""""

This scrit creates stereotype derivate variables. It does so by:
    - normalizing data
        - transform categories into numerical values
        - normalize numerical values


"""

import numpy as np
import plotly.express
import sklearn.cluster
from sklearn.manifold import TSNE
import json
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
from rich import print


import plotly.graph_objects as go
import numpy as np

matplotlib.use('TkAgg')


datainput = "killers/clean-labeled.json"
output = "js/clean-output.json"

dt = open(datainput, "r")
data = json.load(dt)



########## NORMALIZE DATA

X = pd.read_json(datainput)
for c in X.columns:
    m = X[c].max()
    if "IQ" in c or "Number of Victims" in c or "Number of children" in c:
        pass
    if m > 5:
        print("C", c,set(X[c]))
        X.drop(columns=c)
        print("[red]"+c)
    else:
        print("PASSED"+c)




# preplexity 94

figs = []

F = go.Figure()
F.add_scatter(cliponaxis=True)


input = "killers/clean (1).json"
_ = open(input, "r", encoding="UTF-8")
_data = json.load(_,)
_.close()
#with open("clean-killers.json","r") as f:
#    big_input = json.load(f)


print(type(data))
for x in range(5,6):
    X_embedded = TSNE(n_components=2, learning_rate='auto',
                      init='random', perplexity=x).fit_transform(X)
    output = X_embedded.T

    X3D_embedded = TSNE(n_components=3, learning_rate='auto',
                        init='random', perplexity=x).fit_transform(X)
    output3D = X3D_embedded.T

    cluster =  sklearn.cluster.KMeans()
    cluster.fit(X)

    for i,entry in enumerate(_data):
        del entry["Stereotype"]
        del entry["Stereotype Position"]
        entry["stereotype"] = int(cluster.labels_[i])
        entry["stereotype_pos"] = [float(output[0][i]),float(output[1][i])]
#        for k in ["Gender of victims","Sexual preference","Gender"]:
#            try:
#                entry[k] =  big_input[i][k]
#            except:
#                entry[k] =  None

       # entry["stereotype_pos3D"] = [float(output3D[0][i]),float(output3D[1][i]), float(output3D[2][i]) ]
    print(len(set(cluster.labels_)))
    matplotlib.pyplot.scatter(x=output[0],y=output[1], c=cluster.labels_)
    #matplotlib.pyplot.show()

for k in _data:
    for attr in k:
        try:
            if "No" in k[attr]:
                k[attr] = False
            if "Yes" in k[attr]:
                k[attr] = True
        except:
            pass


with open("C:/ist/public/clean_final.json", "w") as wow:
    json.dump(_data, wow)
