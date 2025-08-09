document.addEventListener('DOMContentLoaded', function() {
    try {
        let deletedCount = 0;
        const deletedComments = JSON.parse(localStorage.getItem('deletedComments') || '[]');

        // نمایش تعداد حذف شده‌ها در صفحه
        function updateDeletedCount() {
            let info = document.getElementById('deleted-count-info');
            if (!info) {
                info = document.createElement('p');
                info.id = 'deleted-count-info';
                info.style.color = 'red';
                info.style.fontWeight = 'bold';
                info.style.marginBottom = '1rem';
                document.body.prepend(info);
            }
            info.textContent = `تعداد نظرات حذف شده: ${deletedCount}`;
        }

        // ذخیره حذف‌ها در localStorage
        function logToStorage(commentId) {
            deletedComments.push({id: commentId, time: new Date().toISOString()});
            localStorage.setItem('deletedComments', JSON.stringify(deletedComments));
        }

        // ساخت مودال تایید حذف (سفارشی)
        function createConfirmModal(message, onConfirm, onCancel) {
            // اگر مودال هست پاکش کن
            let existingModal = document.getElementById('confirm-modal');
            if (existingModal) existingModal.remove();

            // ساختار مودال
            const modal = document.createElement('div');
            modal.id = 'confirm-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';

            const box = document.createElement('div');
            box.style.backgroundColor = 'white';
            box.style.padding = '20px';
            box.style.borderRadius = '8px';
            box.style.width = '300px';
            box.style.textAlign = 'center';
            box.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

            const msg = document.createElement('p');
            msg.textContent = message;

            const btnConfirm = document.createElement('button');
            btnConfirm.textContent = 'حذف کن';
            btnConfirm.style.margin = '10px';
            btnConfirm.style.padding = '8px 20px';
            btnConfirm.style.backgroundColor = '#dc3545';
            btnConfirm.style.color = 'white';
            btnConfirm.style.border = 'none';
            btnConfirm.style.borderRadius = '4px';
            btnConfirm.style.cursor = 'pointer';

            const btnCancel = document.createElement('button');
            btnCancel.textContent = 'لغو';
            btnCancel.style.margin = '10px';
            btnCancel.style.padding = '8px 20px';
            btnCancel.style.backgroundColor = '#6c757d';
            btnCancel.style.color = 'white';
            btnCancel.style.border = 'none';
            btnCancel.style.borderRadius = '4px';
            btnCancel.style.cursor = 'pointer';

            box.appendChild(msg);
            box.appendChild(btnConfirm);
            box.appendChild(btnCancel);
            modal.appendChild(box);
            document.body.appendChild(modal);

            btnConfirm.addEventListener('click', () => {
                onConfirm();
                modal.remove();
            });

            btnCancel.addEventListener('click', () => {
                if(onCancel) onCancel();
                modal.remove();
            });

            // کلیک بیرون مودال لغو کنه
            modal.addEventListener('click', (e) => {
                if(e.target === modal) {
                    if(onCancel) onCancel();
                    modal.remove();
                }
            });
        }

        // انیمیشن محو شدن
        function fadeOut(element, callback) {
            element.style.transition = 'opacity 0.5s ease, height 0.5s ease, margin 0.5s ease, padding 0.5s ease';
            element.style.opacity = '0';
            element.style.height = '0';
            element.style.margin = '0';
            element.style.padding = '0';
            setTimeout(() => {
                if(callback) callback();
            }, 500);
        }

        // افزودن دکمه Undo پس از حذف نظر
        function showUndoButton(commentDiv, commentId) {
            const undoBtn = document.createElement('button');
            undoBtn.textContent = 'لغو حذف';
            undoBtn.style.marginTop = '10px';
            undoBtn.classList.add('btn', 'btn-sm', 'btn-secondary');

            let undoTimeout = setTimeout(() => {
                undoBtn.remove();
            }, 5000); // 5 ثانیه فرصت برای لغو حذف

            undoBtn.addEventListener('click', () => {
                clearTimeout(undoTimeout);
                // بازگرداندن نظر به DOM
                commentDiv.style.opacity = '1';
                commentDiv.style.height = '';
                commentDiv.style.margin = '';
                commentDiv.style.padding = '';
                document.body.removeChild(undoBtn);
                document.body.appendChild(commentDiv);
                deletedCount--;
                updateDeletedCount();

                // حذف از localStorage
                const index = deletedComments.findIndex(dc => dc.id === commentId);
                if(index !== -1) {
                    deletedComments.splice(index, 1);
                    localStorage.setItem('deletedComments', JSON.stringify(deletedComments));
                }

                console.log('حذف نظر لغو شد.');
            });

            document.body.appendChild(undoBtn);
        }

        // شروع کار
        const deleteButtons = document.querySelectorAll('a.btn-outline-danger');

        deleteButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();

                // غیرفعال کردن موقت همه دکمه‌ها
                deleteButtons.forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0.6';
                });

                createConfirmModal('آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟',
                    () => {
                        // تایید حذف
                        const commentDiv = button.closest('.comment');
                        if (!commentDiv) {
                            console.error('کامنت یافت نشد!');
                            // فعال کردن دکمه‌ها
                            deleteButtons.forEach(btn => {
                                btn.style.pointerEvents = 'auto';
                                btn.style.opacity = '1';
                            });
                            return;
                        }

                        fadeOut(commentDiv, () => {
                            commentDiv.remove();

                            deletedCount++;
                            updateDeletedCount();

                            const commentId = commentDiv.dataset.commentId;
                            logToStorage(commentId);

                            showUndoButton(commentDiv, commentId);

                            console.log(`نظر حذف شد. تعداد حذف‌ها: ${deletedCount}`);

                            // فعال کردن دکمه‌ها
                            deleteButtons.forEach(btn => {
                                btn.style.pointerEvents = 'auto';
                                btn.style.opacity = '1';
                            });
                        });
                    },
                    () => {
                        // لغو حذف
                        console.log('حذف نظر لغو شد.');
                        // فعال کردن دکمه‌ها
                        deleteButtons.forEach(btn => {
                            btn.style.pointerEvents = 'auto';
                            btn.style.opacity = '1';
                        });
                    }
                );
            });
        });

        // مقدار اولیه تعداد حذف شده‌ها را نمایش بده (اگر localStorage خالی نیست)
        deletedCount = deletedComments.length;
        updateDeletedCount();

    } catch (error) {
        console.error('خطا در بارگذاری اسکریپت حذف نظرات:', error);
    }
});
