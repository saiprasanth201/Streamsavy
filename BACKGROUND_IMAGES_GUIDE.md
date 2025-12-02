# How to Add Background Images to Sign Up, Sign In, and Payment Pages

## Method 1: Using CSS (Recommended)

### Step 1: Add your images to the `public` folder
Place your background images in the `public` folder:
- `public/signup-bg.jpg` (or .png, .webp, etc.)
- `public/signin-bg.jpg`
- `public/payment-bg.jpg`

### Step 2: Update CSS in `src/App.css`

#### For Sign Up and Sign In pages:
Find `.auth-page__background` (around line 1876) and update it:

```css
.auth-page__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a0000 100%);
  background-image: url('/signup-bg.jpg'); /* Add your image path here */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}
```

**Note:** If you want different images for Sign Up and Sign In, you can create separate classes:
- `.signup-page__background` for Sign Up
- `.signin-page__background` for Sign In

#### For Payment page:
Find `.payment-page__background` (around line 2089) and update it:

```css
.payment-page__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a0000 100%);
  background-image: url('/payment-bg.jpg'); /* Add your image path here */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}
```

### Step 3: Adjust overlay opacity (optional)
If the image is too bright, adjust the overlay in `.auth-page__overlay` or `.payment-page__overlay`:

```css
.auth-page__overlay {
  background: rgba(0, 0, 0, 0.7); /* Increase from 0.6 to 0.7 or higher for darker overlay */
}
```

---

## Method 2: Using Inline Styles (Different images per page)

### Step 1: Update SignUp.jsx
```jsx
<div className="auth-page">
  <div 
    className="auth-page__background"
    style={{ backgroundImage: "url('/signup-bg.jpg')" }}
  />
  <div className="auth-page__overlay" />
  {/* rest of the component */}
</div>
```

### Step 2: Update SignIn.jsx
```jsx
<div className="auth-page">
  <div 
    className="auth-page__background"
    style={{ backgroundImage: "url('/signin-bg.jpg')" }}
  />
  <div className="auth-page__overlay" />
  {/* rest of the component */}
</div>
```

### Step 3: Update Payment.jsx
```jsx
<div className="payment-page">
  <div 
    className="payment-page__background"
    style={{ backgroundImage: "url('/payment-bg.jpg')" }}
  />
  <div className="payment-page__overlay" />
  {/* rest of the component */}
</div>
```

---

## Method 3: Using Props (Most Flexible)

### Step 1: Update SignUp.jsx to accept backgroundImage prop
```jsx
const SignUp = ({ backgroundImage = '/signup-bg.jpg' }) => {
  return (
    <div className="auth-page">
      <div 
        className="auth-page__background"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      {/* rest of the component */}
    </div>
  );
};
```

### Step 2: Update SignIn.jsx similarly
```jsx
const SignIn = ({ backgroundImage = '/signin-bg.jpg' }) => {
  return (
    <div className="auth-page">
      <div 
        className="auth-page__background"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      {/* rest of the component */}
    </div>
  );
};
```

### Step 3: Update Payment.jsx similarly
```jsx
const Payment = ({ backgroundImage = '/payment-bg.jpg' }) => {
  return (
    <div className="payment-page">
      <div 
        className="payment-page__background"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      {/* rest of the component */}
    </div>
  );
};
```

---

## Tips:

1. **Image Formats:** Use `.jpg`, `.png`, or `.webp` formats
2. **Image Size:** Optimize images for web (recommended: 1920x1080 or similar)
3. **Overlay:** The dark overlay ensures text remains readable over bright images
4. **Fallback:** The gradient background serves as a fallback if the image fails to load
5. **Performance:** Consider using WebP format for better compression

---

## Example: Complete CSS Update

If you want to use the same image for all auth pages:

```css
.auth-page__background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a0000 0%, #2d0000 50%, #1a0000 100%);
  background-image: url('/auth-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}
```

If you want different images, use Method 2 or 3 above.

