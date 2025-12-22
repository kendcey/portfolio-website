#!/usr/bin/env python3
"""
Create a painter's palette favicon
"""
try:
    from PIL import Image, ImageDraw
    import sys
    import os
    
    favicon_path = "favicon.png"
    size = 32
    
    # Create a transparent 32x32 image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw painter's palette shape (rounded rectangle with thumb hole)
    # Main palette body
    palette_coords = [(4, 8), (28, 8), (28, 24), (12, 24), (8, 20), (4, 16)]
    
    # Draw the palette shape (rounded rectangle with thumb cutout)
    # Main body
    draw.ellipse([4, 8, 28, 24], fill=(40, 30, 20, 255), outline=(0, 0, 0, 255), width=1)  # Brown palette
    
    # Thumb hole (cutout)
    draw.ellipse([6, 12, 12, 18], fill=(0, 0, 0, 0), outline=(0, 0, 0, 255), width=1)  # Transparent cutout
    
    # Paint blobs on the palette
    # Red paint
    draw.ellipse([10, 10, 14, 14], fill=(220, 20, 60, 255), outline=(0, 0, 0, 255), width=1)
    
    # Blue paint
    draw.ellipse([16, 10, 20, 14], fill=(30, 144, 255, 255), outline=(0, 0, 0, 255), width=1)
    
    # Yellow paint
    draw.ellipse([22, 10, 26, 14], fill=(255, 215, 0, 255), outline=(0, 0, 0, 255), width=1)
    
    # Green paint
    draw.ellipse([10, 16, 14, 20], fill=(50, 205, 50, 255), outline=(0, 0, 0, 255), width=1)
    
    # Purple paint
    draw.ellipse([16, 16, 20, 20], fill=(138, 43, 226, 255), outline=(0, 0, 0, 255), width=1)
    
    # Orange paint
    draw.ellipse([22, 16, 26, 20], fill=(255, 140, 0, 255), outline=(0, 0, 0, 255), width=1)
    
    # Save as favicon
    img.save(favicon_path, 'PNG')
    print(f"Created painter's palette favicon at {favicon_path}")
    
except ImportError:
    import sys
    print("PIL/Pillow not available. Please install Pillow: pip3 install Pillow")
    sys.exit(1)
except Exception as e:
    print(f"Error creating favicon: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

