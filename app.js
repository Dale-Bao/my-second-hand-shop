document.addEventListener('DOMContentLoaded', () => {
    // 选中 HTML 中的模态框元素
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.getElementById('close-modal');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');
    const counter = document.getElementById('image-counter');

    // 用于记录当前点开的商品的图片数组和当前查看的页码
    let currentImages = [];
    let currentIndex = 0;

    // 获取并渲染商品列表
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                
                // 安全判定：如果没有图片数组，给个空字符串防报错
                const coverImage = (item.images && item.images.length > 0) ? item.images[0] : '';
                // 判断是否显示 "X图" 角标
                const badgeHtml = (item.images && item.images.length > 1) ? `<span class="img-badge">📸 ${item.images.length} 图</span>` : '';

                card.innerHTML = `
                    <div class="image-wrapper" title="点击查看大图">
                        <img src="${coverImage}" alt="${item.name}">
                        ${badgeHtml}
                    </div>
                    <div class="card-content">
                        <h2>${item.name}</h2>
                        <p class="price">${item.price}</p>
                        <p class="desc">${item.description}</p>
                        <span class="status ${item.status === '已售出' ? 'sold' : 'active'}">${item.status}</span>
                    </div>
                `;
                productList.appendChild(card);

                // 给当前的 "图片区域" 绑定点击事件，用来打开相册
                const imgWrapper = card.querySelector('.image-wrapper');
                imgWrapper.addEventListener('click', () => {
                    openModal(item.images);
                });
            });
        })
        .catch(error => console.error('Error loading products:', error));

    // ==========================================
    // 画廊（模态框）控制逻辑
    // ==========================================
    
    function openModal(imagesArray) {
        if (!imagesArray || imagesArray.length === 0) return;
        currentImages = imagesArray;
        currentIndex = 0; // 默认展示第一张图
        updateModalContent();
        modal.classList.add('active'); // 显示模态框
        document.body.style.overflow = 'hidden'; // 防止背景跟着一起上下滚动
    }

    function updateModalContent() {
        modalImg.src = currentImages[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        
        // 如果只有一张图，隐藏左右切换按钮；有多图则显示
        const displayNav = currentImages.length > 1 ? 'block' : 'none';
        prevBtn.style.display = displayNav;
        nextBtn.style.display = displayNav;
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }

    // 事件绑定：点击关闭
    closeBtn.addEventListener('click', closeModal);
    
    // 事件绑定：点击模态框黑色背景区也能关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 事件绑定：上一张图 (如果是第一张，就跳到最后一张)
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? currentImages.length - 1 : currentIndex - 1;
        updateModalContent();
    });

    // 事件绑定：下一张图 (如果是最后一张，就回到第一张)
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === currentImages.length - 1) ? 0 : currentIndex + 1;
        updateModalContent();
    });
});
