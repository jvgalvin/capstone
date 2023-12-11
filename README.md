# Multimodal Prediction of Alzheimer's Disease Onset
Alzheimer's Disease (AD) is a complex neurodegenerative disease that severely affects patients (and their families') quality of life and is expected to cost the US $1T by 2050. 40% of primary care physicians report that they are "never" or "only sometimes" comfortable diagnosing AD. Early detection can result in significantly improved outcomes. In fact, early diagnosis can lower yearly costs by up to 20%. Most existing solutions that use machine learning to predict the onset of AD tend to focus only on using MRI. Since AD also includes genetic and cognitive components, we think that models which predict its onset ought to as well.

### Solution
We aim to improve health outcomes for Alzheimer's patients by enabling earlier diagnosis of the disease. Contrary to existing approaches which only use MRI data, we use genetic, cognitive, and MRI data to predict the probability of AD onset within the next 5 years.

We have developed a completely containerized end-to-end application for the prediction of AD onset. You can follow the instructions below to run the application locally using Minikube. Please note that the inclusion of a database is meant to mimic integration with an EHR system.

### Mission
Improve health outcomes for Alzheimer's patients and ease the burden of care through the use of machine learning for earlier diagnosis.

### Data
We used data available from the Alzheimer's Disease Neuroimaging Initiative to train our model. Our final dataset includes MRI, genetic, and cognitive data from 606 ADNI participants (this does not include the oversampling we did within the training set to balance classes). Labeled cortical surfaces and labeled cortical and noncortical volumes were extracted from raw 1.5 Tesla T-1 weighted MRI scans using FreeSurfer. ANTs was used for brain volume extraction, segmentation, and registration-based labeling, using the output of the FreeSurfer pipeline as input. Volumes of all labeled regions and thickness of all labeled cortical regions was generated using Mindboggle, using the output of the ANTs pipeline as input. Finally, we used Principal Components Analysis (PCA) to reduce the 2150 Mindboggle measurements to 150 features, which explain roughly 80% of the cumulative variance in the dataset. Below is a sample training record.

| Feature | Type | Description |
|----------|----------|----------|
| Diagnosis_at_Baseline    | str    | CN (cognitively normal, 0) or LCMI (late cognitive mild impairment, 1)  |
| Age    | int   | Age of the patient in years  |
| Gender    | int    | Female (0) or Male (1)    |
| Years_of_Education   | int   | Years of education of the patient   |
| Ethnicity    | int    | Hisp/Latino (0), Not Hisp/Latino (1), Other (2)    |
| Race    | int   | Asian (0), Black (1), White (2)   |
| APOE4   | int   | Number of copies of allele  |
| MMSE  | int   | Most recent MMSE score  |
| Brain_Measurement_1   | float   | Mindboggle brain measurement   |
| ...  | ...  | ...  |
| Brain_Measurement_150  | float   | Mindboggle brain measurement  |

### Model and Experimentation
The models we trained include a neural network (NN), support vector machine (SVM), random forest classifier (RFC), and XGBoost. The NN, SVM, and RFC models were trained in the multimodal scenario (see training sample above) as well as image-only scenario (only the 150 Mindboggle measurements with no cognitive or genetic data). The final model we selected for deployment (NN, multimodal) is a fully connected neural network with 2 hidden layers of size 256 and 128. A dropout layer (0.3) follows each hidden layer. We used L1L2 regularization within each hidden layer (1e-3 penalty), a learning rate of 1e-3 with early stopping, and batch size of 16. Finally, we used 5-fold cross validation to assess how the model will generalize. The table below displays our results (test set, 100 patients) for the task of predicting the probability of a given patient developing AD within 5 years. 

The baseline represents a model that naively guesses the majority class all the time. Accuracy is the percentage of correct predictions divided by the total size of the test set. Precision is the ratio of true positives to true positives plus false positives. Recall is the ratio of true positives to true positives plus false negatives. F1 is the harmonic mean between precision and recall.

| *5 year horizon*| Accuracy | Precision | Recall | F1 |
|----------|----------|----------|----------|----------|
| Baseline    | 0.66   | 0   | 0   | 0   |
| NN, multimodal    | 0.78  | 0.68   | **0.68**   | **0.68**   |
| NN, image-only    | 0.55    | 0.32   | 0.35    | 0.34   |
| SVM, multimodal   | 0.69  | 0.80    | 0.12  | 0.21  |
| SVM, image-only  | 0.66   | 0   | 0   | 0   |
| RFC, multimodal   | **0.80**   | **0.82**    | 0.53   | 0.64   |
| RFC, image-only    | 0.65  | 0.48   | 0.32   | 0.39    |
| XGBoost, multimodal   | 0.79   | 0.76    | 0.56   | 0.64   |

Please see the final presentation within the slides directory of this repository for additional details and an explanation of model performance with Shapley values.

# Running the Application
The instructions below describe how to run the application.

### Deploy to Minikube
Run the following commands from the root directory (capstone). Note that these commands assume you have Minikube installed.

    minikube start
    sh kube-setup.sh

Once the images have been built, navigate to http://localhost:3000 in a web browswer to access the application. When you are finished, run the command below:

    sh kube-stop.sh

### Build Manually (this will affect your local setup)
It's recommended that you run these within a VS Code Devcontainer. Run these from the root directory (capstone).

    pip install -r requirements.txt
    cd ui/alzheimer-predict-ui
    npm install
    cd ../../
    sh setup-db.sh
    uvicorn project.src.main:app
    cd ui/alzheimer-predict-ui
    npm start

Navigate to http://localhost:3000 in a web browswer to access the application.

# Demo Video

A complete demo video can be found at: (https://www.youtube.com/watch?v=D_dOtXs5guw)

https://github.com/jvgalvin/capstone/assets/78283671/5186042e-2276-45a5-a7fc-d4174e809bc8


