import random
from inspektor.apps.core.models import Image, Result, ResultStatus


def run_inference_on_image(image: Image):
    """
    Implement this function to run inference on the given image.

    Method save the mock_result object in the `Result` table.

    PROCESS: first we are creating the result object with "In Progress" status.
    Then we are applying out `ML` logic. After that we updating the status
    to "Pass" or "Fail" on the basis of the result.

    Args:
        image: Image

    NOTE: Currently considering one image per result
    """

    resultObj, _ = Result.objects.get_or_create(
        image=image, defaults={"result": None, "status": ResultStatus.IN_PROGRESS}
    )

    # TODO: implement here `ML` logic.

    # Its just a mock result of `ML`

    mock_result = [
        {
            "type": "object type 1",
            "properties": {
                "coordinates": [262, 94, 461, 313],
                "category": "object category",
                "detected": 57.0,
                "resultTxt": "It seems like broken",
            },
            "result": 1,
        },
        {
            "type": "object type 2",
            "properties": {
                "coordinates": [120, 30, 301, 201],
                "category": "object category",
                "detected": 89.0,
                "result": "Condition is fine",
            },
            "result": 1,
        },
        {
            "type": "object type 3",
            "properties": {
                "coordinates": [140, 36, 201, 29],
                "category": "object category",
                "detected": 29.0,
                "result": "Condition unknown",
            },
            "result": 0,
        },
    ]
    result = mock_result[random.randint(0, len(mock_result) - 1)]

    # Here we are saving mock results and its status
    resultObj.result = result
    resultObj.status = ResultStatus.PASS if result["result"] == 1 else ResultStatus.FAIL
    resultObj.save()
