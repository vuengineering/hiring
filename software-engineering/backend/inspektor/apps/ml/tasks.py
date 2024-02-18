from inspektor.apps.core.models import Image
import random

def some_inspection_algorithm(image):
    """
    Implement the inspection algorithm.
    This is a simplified and placeholder implementation used for testing purposes.

    Args:
        image: Image object

    Returns:
        bool: True if the image is defective, False otherwise
    """
    # Access the image file
    image_file = image.file
    
    from PIL import Image as PILImage

    with image_file.open() as f:
        pil_image = PILImage.open(f)
        image_width, image_height = pil_image.size

    # Introduce randomness based on image properties
    defect_threshold = 100
    defect_probability = random.random()

    # Calculate defect probability based on image properties
    if image_width < defect_threshold:
        defect_probability *= 0.8  # Reduce defect probability for smaller images
    else:
        defect_probability *= 1.2  # Increase defect probability for larger images

    # Determine if the image is defective based on defect probability
    is_defective = defect_probability > 0.5

    return is_defective

def run_inference_on_image(image: Image):
    """
    Implement this function to run inference on the given image.
    Args:
        image: Image

    Returns:
        str: Inspection result, either "Defective" or "Good"
    """
    # Call the placeholder inspection algorithm
    is_defective = some_inspection_algorithm(image)

    # Determine the inspection result based on the outcome of the inspection algorithm
    if is_defective:
        result = "Defective"
    else:
        result = "Good"

    return result
