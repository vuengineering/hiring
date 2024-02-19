## SUMUP
I supposed that 1 single inspection will be run for every pìcture after the image has been added to the case, that is, upon image creation on DB. I modified the back-end so we have a new model Inspection with a FK poiting to the related picture. I recreated a 1toMany relatioship in case a single image can have more than one inspection, so I also modified the Image serializer to include the array of related inspections upon image get requests.

About the front-end, now when we open a Case we are retrieving all its related images and all the inspection for each image, so I modified the ImageGrid and created ImageGridItem component to properly show each image and the results of the last inspection directly in the card, as well as the inspection errors in case there were, and also a button that will open a modal showing the whole inspection historic for one image.

<b>Tests</b>: Due to time restrictions I could not develop tests at all. Unit tests should be included for tasks.py and integration test, or what I'd prefer endpoint tests for the models and its integration with the rest of the modules. React tests should also be developed.

### INSPEKTOR CORE
+ models.py -> Added Inspection model: Fields inspection_time, inspection_result, inspection_errors and FK Image.
+ models.py -> Changes on Image model: toString() method
+ serializers.py -> ImageSerializer modified: Added array of related "inspections".
+ serializers.py -> InspectionSerializer: All fields included, image will be the PK Related Field.
+ views.py --> InspectionViewSet created for handling create(), list(), update(), etc. inspections.
+ urls.py --> Registered InspectionViewSet as "inspections" to router in django admin app.
+ admin.py --> New Section on admin panel to access Inspections.

### INSPEKTOR ML
+ tasks.py --> Mocked version of run_inference_on_image to run Image inspections.

### BACK-END STRUCTURE CHANGES
+ Models module split in separate files for readability and scalability.

### FRONTEND STYLES
+ App.tsx --> Importing EUI styles to enhance UI.
+ CardWithBadge.css --> Some CSS styles for cards.

### FRONT-END
+ ImageGrid.tsx --> ImageGrid reformatted to use ImageGridItem components.
+ ImageGrid.tsx --> Modal included to show inspections history for an image.
+ ImageGridItem.tsx --> New comp to show the images for a case. It will also show inspection results for related img.
+ utils.tsx --> Added InspectionsClient to handle InspectionApi


*See git commit history and comments</sub>
