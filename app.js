document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            data.forEach(item => {
                // 创建商品卡片
                const card = document.createElement('div');
                card.className = 'card';
                
                // 卡片内部 HTML (结合图片、名称、价格、描述)
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="card-content">
                        <h2>${item.name}</h2>
                        <p class="price">${item.price}</p>
                        <p class="desc">${item.description}</p>
                        <span class="status ${item.status === '已售出' ? 'sold' : 'active'}">${item.status}</span>
                    </div>
                `;
                productList.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading products:', error));
});