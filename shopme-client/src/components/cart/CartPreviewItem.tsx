import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoute } from '../../hooks/useRoutes';
import { ROUTES } from '../../config/appConfig';
import { CartItem } from '../../types/cart';

interface CartPreviewItemProps {
  item: CartItem;
}

const CartPreviewItem: React.FC<CartPreviewItemProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(createRoute(ROUTES.PRODUCT_DETAIL, { id: item.productId.toString() }));
  };

  return (
    <div 
      key={item.productId} 
      className="flex items-center mb-2 pb-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-1 rounded"
      onClick={handleClick}
    >
      <div className="w-10 h-10 mr-2 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
        <img 
          src={item.mainImage} 
          alt={item.name} 
          className="w-full h-full object-contain" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loops
            target.src = '/placeholder-image.png'; // Fallback image
          }}
        />
      </div>
      <div className="flex-1">
        <p className="text-xs truncate font-medium hover:text-primary-500">{item.name}</p>
        <p className="text-xs text-primary-500">{item.discountPrice.toLocaleString('vi-VN')}đ x {item.quantity}</p>
      </div>
    </div>
  );
};

export default CartPreviewItem;
