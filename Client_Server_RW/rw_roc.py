import pandas as pd
import numpy as np
from sklearn.metrics import roc_curve
from flask import Flask,jsonify
import json
from flask_cors import CORS
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn import metrics


app = Flask(__name__)
# Connection
CORS(app)
@app.route('/roc_curve/processing=<prep>&c=<c>', methods=['GET'])
def roc_curve(prep,c):    
    df = pd.read_csv('data/transfusion.data')
    xDf = df.loc[:, df.columns != 'Donated']
    y = df['Donated']

    # get random numbers to split into train and test
    np.random.seed(1)
    r = np.random.rand(len(df))

    # split into train test
    X_train = xDf[r < 0.8]
    X_test = xDf[r >= 0.8]
    y_train = y[r < 0.8]
    y_test = y[r >= 0.8]

    #Standardization
    if prep == "normalization":
        scaler = MinMaxScaler()
    else:
        scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    #Logistic Regression
    LR = LogisticRegression(C= float(c), random_state=0, solver='lbfgs',multi_class='multinomial')
    LR.fit(X_train, y_train)
    probs = LR.predict_proba(X_test)
    fprs, tprs, thresholds = metrics.roc_curve(y_test, probs[:,1], pos_label=1)
    
    # Return a list of dictionaries
    dicts = []
    for i in range(len(fprs)):
        dicts.append({"fpr":fprs[i],"tpr":tprs[i]})
    return json.dumps(dicts)

if __name__ == '__main__':
    app.run() 

