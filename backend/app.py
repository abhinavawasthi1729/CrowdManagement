from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import base64
import io
import numpy as np
import matplotlib.pyplot as plt
from model_utils import load_model, preprocess_image
import matplotlib.cm as cm

app = Flask(__name__)
CORS(app)

model = load_model('best_model.pth')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    img = Image.open(request.files['image']).convert('RGB')
    input_tensor = preprocess_image(img).unsqueeze(0).to('cuda' if torch.cuda.is_available() else 'cpu')

    with torch.no_grad():
        output = model(input_tensor)
        count = float(output.sum().item())
        heatmap = output.squeeze().cpu().numpy()

    # Convert heatmap to base64 PNG
    # fig, ax = plt.subplots()
    # ax.imshow(img)
    # ax.imshow(heatmap, cmap='jet', alpha=0.5)
    # ax.axis('off')
    # buf = io.BytesIO()
    # plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    # plt.close()
    # buf.seek(0)
    # heatmap_b64 = base64.b64encode(buf.read()).decode('utf-8')

    # Convert heatmap to base64 PNG with enhanced heatmap overlay


    # Normalize heatmap between 0 and 1
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)

    # Resize heatmap to match image size
    heatmap_resized = np.array(img.resize((heatmap.shape[1], heatmap.shape[0])))
    heatmap_colored = cm.jet(heatmap)[:, :, :3]  # Apply colormap and drop alpha

    # Blend image and heatmap
    heatmap_overlay = (0.6 * heatmap_colored * 255 + 0.4 * heatmap_resized).astype(np.uint8)

    # Convert to image
    # Convert to image and resize to bigger output
    overlay_image = Image.fromarray(heatmap_overlay)

    # Resize to bigger size (e.g., double)
    bigger_image = overlay_image.resize((overlay_image.width * 5, overlay_image.height * 4), Image.BICUBIC)

    # Convert to base64
    buf = io.BytesIO()
    bigger_image.save(buf, format='PNG')
    buf.seek(0)
    heatmap_b64 = base64.b64encode(buf.read()).decode('utf-8')

    return jsonify({
        'count': round(count, 2),
        'heatmap': heatmap_b64
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
