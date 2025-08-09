document.addEventListener('DOMContentLoaded', () => {
    console.log('صفحه بارگذاری شد.');

    // اضافه کردن کلاس‌های css لازم (باید این کلاس‌ها رو در CSS هم تعریف کنی)
    const style = document.createElement('style');
    style.textContent = `
        .card-hover {
            box-shadow: 0 8px 20px rgba(0,0,0,0.3);
            transform: scale(1.05);
            transition: all 0.3s ease;
            z-index: 2;
        }
        .desc-collapsed {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 3em;
            transition: max-height 0.3s ease;
        }
        .desc-expanded {
            white-space: normal;
            overflow: visible;
            text-overflow: clip;
            max-height: 100vh;
            transition: max-height 0.5s ease;
        }
        .toggle-btn {
            cursor: pointer;
            margin-top: 8px;
        }
        .hidden {
            display: none !important;
        }
        .filter-container {
            text-align: center;
            margin: 20px 0;
        }
        .filter-input {
            padding: 8px;
            width: 250px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .counter {
            margin-top: 10px;
            font-weight: bold;
            color: #007bff;
        }
    `;
    document.head.appendChild(style);

    // مدیریت هاور کارت‌ها با کلاس
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('card-hover'));
        card.addEventListener('mouseleave', () => card.classList.remove('card-hover'));
    });

    // ایجاد دکمه نمایش/مخفی توضیحات
    cards.forEach(card => {
        const desc = card.querySelector('.card-text');
        if (!desc) return;

        desc.classList.add('desc-collapsed');

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'نمایش توضیحات بیشتر';
        toggleBtn.className = 'btn btn-sm btn-info toggle-btn';

        toggleBtn.addEventListener('click', () => {
            const expanded = desc.classList.toggle('desc-expanded');
            desc.classList.toggle('desc-collapsed');
            toggleBtn.textContent = expanded ? 'مخفی کردن توضیحات' : 'نمایش توضیحات بیشتر';
        });

        desc.after(toggleBtn);
    });

    // ساخت بخش فیلتر و شمارش کتاب‌ها
    const container = document.querySelector('.container');
    if (!container) return;

    const filterDiv = document.createElement('div');
    filterDiv.className = 'filter-container';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'جستجو بر اساس نویسنده...';
    input.className = 'filter-input';

    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = `تعداد کتاب‌ها: ${cards.length}`;

    filterDiv.appendChild(input);
    filterDiv.appendChild(counter);
    container.prepend(filterDiv);

    // debounce برای بهبود عملکرد جستجو
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    const filterBooks = () => {
        const value = input.value.trim().toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
            const authorElem = card.querySelector('.text-muted');
            if (!authorElem) return;

            const authorText = authorElem.textContent.toLowerCase();
            if (authorText.includes(value)) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        counter.textContent = `تعداد کتاب‌های نمایش داده شده: ${visibleCount}`;
    };

    input.addEventListener('input', debounce(filterBooks, 300));
});
