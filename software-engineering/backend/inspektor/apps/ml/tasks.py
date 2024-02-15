import io

import cv2
import numpy as np
import tensorflow as tf


class InferenceProcessor:
    def __init__(self, model: str):
        self.__model = tf.keras.models.load_model(model)
        self.__dimension = self.__model.input_shape[1:3]

    @staticmethod
    def __trim_image(image: np.array) -> np.array:
        # we crop this image to square in the center and accept removal of odd row
        if image.shape[0] > image.shape[1]:
            # portrait
            shortest_div_2 = image.shape[1] // 2
            longest_div_2 = image.shape[0] // 2
            image = image[
                longest_div_2 - shortest_div_2 : longest_div_2 + shortest_div_2,
                : shortest_div_2 * 2,
                ::,
            ]

        elif image.shape[0] < image.shape[1]:
            # horizontal
            shortest_div_2 = image.shape[0] // 2
            longest_div_2 = image.shape[1] // 2
            image = image[
                : shortest_div_2 * 2,
                longest_div_2 - shortest_div_2 : longest_div_2 + shortest_div_2,
                ::,
            ]

        return image

    def __scale_image(self, image: np.array) -> np.array:
        if image.shape[:2] != self.__dimension:
            image = cv2.resize(image, self.__dimension, interpolation=cv2.INTER_AREA)

        return image

    def run_inference_on_image(self, image: io.FileIO) -> int:
        """
        Implement this function to run inference on the given image.
        Args:
            image: Image

        Returns: classification result as int

        """
        image = cv2.imdecode(
            np.asarray(bytearray(image.read()), dtype=np.uint8), cv2.IMREAD_COLOR
        )
        image = self.__scale_image(self.__trim_image(image))

        image_matrix_batch = np.stack([image])
        result_batch = self.__model.predict(image_matrix_batch, verbose=0)

        return np.argmax(result_batch[0, ::])
