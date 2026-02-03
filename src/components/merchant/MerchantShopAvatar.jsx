import React from 'react';
import { Store } from 'lucide-react';

const MerchantShopAvatar = ({ name, size = 48 }) => {
    return (
        <div
            className="rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
            style={{ width: size, height: size }}
        >
            <Store className="text-white" size={size * 0.5} />
        </div>
    );
};

export default MerchantShopAvatar;
