from unittest.mock import patch, PropertyMock
from unittest import TestCase

import numpy as np

from inspektor.apps.ml.tasks import InferenceProcessor


class InferenceProcessorTestCase(TestCase):
    @patch("cv2.resize")
    @patch("tensorflow.keras.models.load_model")
    def test_image_is_not_scaled_up(self, load_model, resize):
        # Given
        instance = load_model.return_value
        type(instance).input_shape = PropertyMock(return_value=(None, 12, 12, 3))
        processor_instance = InferenceProcessor("")
        image = np.zeros((12, 12, 3))

        # When
        scaled_image = processor_instance._InferenceProcessor__scale_image(image)

        # Then
        self.assertTrue(scaled_image is image, "Method returned different object")
        self.assertFalse(resize.called, "Method resize should not be called")

    @patch("cv2.resize")
    @patch("tensorflow.keras.models.load_model")
    def test_image_is_scaled_up(self, load_model, resize):
        # Given
        instance = load_model.return_value
        type(instance).input_shape = PropertyMock(return_value=(None, 12, 12, 3))
        processor_instance = InferenceProcessor("")
        image = np.zeros((128, 128, 3))
        output_image = object()
        resize.return_value = output_image

        # When
        scaled_image = processor_instance._InferenceProcessor__scale_image(image)

        # Then
        self.assertTrue(
            scaled_image is output_image,
            "Method returned different object than expected",
        )
        self.assertTrue(resize.called, "Method resize should be called")
