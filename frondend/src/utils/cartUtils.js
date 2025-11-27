// Cart utility functions for localStorage management

const CART_STORAGE_KEY = 'tailor_lab_cart';

// Get all cart items from localStorage
export const getCartItems = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Save cart items to localStorage
export const saveCartItems = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
    return false;
  }
};

// Add item to cart
export const addToCart = (product) => {
  const cartItems = getCartItems();
  const quantityToAdd = Math.max(1, product.quantity || 1);
  const providedMax = Number(product.maxQuantity);
  const incomingMax =
    Number.isFinite(providedMax) && providedMax > 0 ? providedMax : undefined;
  
  // Check if item already exists (same product_id, size, and color)
  const existingIndex = cartItems.findIndex(
    item => 
      item.product_id === product.product_id &&
      item.size === product.size &&
      item.color === product.color
  );

  if (existingIndex !== -1) {
    const existingItem = cartItems[existingIndex];
    if (product.color_hex) {
      existingItem.color_hex = product.color_hex;
    }

    const existingMax = Number(existingItem.maxQuantity);
    const resolvedExistingMax =
      Number.isFinite(existingMax) && existingMax > 0 ? existingMax : undefined;
    const effectiveMax = Math.min(
      resolvedExistingMax ?? Infinity,
      incomingMax ?? Infinity
    );

    if (effectiveMax !== Infinity) {
      existingItem.maxQuantity = effectiveMax;
    }

    const newQuantity = Math.min(
      existingItem.quantity + quantityToAdd,
      effectiveMax === Infinity ? Infinity : effectiveMax
    );
    existingItem.quantity = newQuantity;
  } else {
    // Add new item
    const newItem = {
      product_id: product.product_id,
      name: product.name,
      price: parseFloat(product.price),
      image_url: product.image_url,
      size: product.size || '',
      color: product.color || '',
      color_hex: product.color_hex || '',
      category: product.category || '',
      quantity: incomingMax
        ? Math.min(quantityToAdd, incomingMax)
        : quantityToAdd
    };

    if (incomingMax) {
      newItem.maxQuantity = incomingMax;
    }

    cartItems.push(newItem);
  }

  saveCartItems(cartItems);
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('cartUpdated'));
  return cartItems;
};

// Remove item from cart by index
export const removeFromCart = (index) => {
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  saveCartItems(cartItems);
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('cartUpdated'));
  return cartItems;
};

// Update item quantity in cart
export const updateCartItemQuantity = (index, quantity) => {
  const cartItems = getCartItems();
  if (cartItems[index]) {
    const max = Number(cartItems[index].maxQuantity);
    const resolvedMax = Number.isFinite(max) && max > 0 ? max : undefined;
    const clampedQuantity = resolvedMax
      ? Math.min(Math.max(1, quantity), resolvedMax)
      : Math.max(1, quantity);

    cartItems[index].quantity = clampedQuantity;
    saveCartItems(cartItems);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('cartUpdated'));
  }
  return cartItems;
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event('cartUpdated'));
  return [];
};

// Calculate cart total
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Get cart items count
export const getCartItemsCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((count, item) => count + item.quantity, 0);
};

