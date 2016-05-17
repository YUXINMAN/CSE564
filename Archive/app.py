from flask import Flask, request, render_template, redirect, url_for, jsonify
import flask
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
from numpy import *
from scipy.cluster.vq import kmeans,vq
import sklearn
import sklearn.decomposition
from sklearn.preprocessing import StandardScaler
from sklearn import manifold
import numpy
import scipy
import copy

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'Visual'
COLLECTION_NAME = 'house'

FIELDS = {'_id': False, 'DIVISION' : True, "REGION" : True, 'ST' : True, 'BLD' : True,
          'TEN' : True, 'ACR' : True, 'FES' : True, 'FINCP' : True, 'WORKSTAT' : True}
CONDITION = {"$and": [{'FINCP' : {"$nin":['']}}, {'WORKSTAT' : {"$nin":['']}}, {'BLD' : {"$nin":['']}}]}
CONDITIONpca = {"$and": [{'FINCP' : {"$nin":['']}}, {'WORKSTAT' : {"$nin":['']}}, {'BLD' : {"$nin":['']}}, {'DIVISION' : {"$nin":['']}}
                      , {'REGION' : {"$nin":['']}}, {'ST' : {"$nin":['']}}, {'ACR' : {"$nin":['']}}, {'TEN' : {"$nin":['']}}, {'FES' : {"$nin":['']}}]}


@app.route("/")
def index():
    return render_template("index.html")
@app.route("/state")
def index1():
    return render_template("state.html")
@app.route("/work")
def index2():
    return render_template("work.html")
@app.route("/house")
def index3():
    return render_template("house.html")


def createDataset():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(filter=CONDITION, projection=FIELDS).limit(2000)
    connection.close()
    dataset = []
    for item in projects:
        dataset.append(item)
    return dataset
data = createDataset()

def createDatasetpca():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(filter=CONDITIONpca, projection=FIELDS).limit(2000)
    connection.close()
    dataset = []
    for item in projects:
        dataset.append(item)
    return dataset
origin_data = createDatasetpca()


@app.route("/data")
def byOriginData():
    return result_data['origin']

def getData():
    json_str = json.dumps(data, default=json_util.default)
    return json_str

@app.route("/fincpbywork1")
def byWork1Data():
    return result_data['fincpbywork1']

def fincpByWorkstat1():
    dataset =  data
    print 'haha:', dataset[0]
    bin = []
    for item in dataset:
        if item['WORKSTAT'] == 5 or  item['WORKSTAT'] == 6 or  item['WORKSTAT'] == 8 or  item['WORKSTAT'] == 9:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbywork2")
def byWork2Data():
    return result_data['fincpbywork2']

def fincpByWorkstat2():
    dataset =  data
    bin = []
    for item in dataset:
        if item['WORKSTAT'] == 2 or  item['WORKSTAT'] == 3 or  item['WORKSTAT'] == 4 or  item['WORKSTAT'] == 7:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbywork3")
def byWork3Data():
    return result_data['fincpbywork3']

def fincpByWorkstat3():
    dataset =  data
    bin = []
    for item in dataset:
        if item['WORKSTAT'] == 1:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbywork4")
def byWork4Data():
    return result_data['fincpbywork4']

def fincpByWorkstat4():
    dataset =  data
    bin = []
    for item in dataset:
        if item['WORKSTAT'] == 11 or  item['WORKSTAT'] == 12 or  item['WORKSTAT'] == 14 or  item['WORKSTAT'] == 15:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbywork5")
def byWork5Data():
    return result_data['fincpbywork5']

def fincpByWorkstat5():
    dataset =  data
    bin = []
    for item in dataset:
        if item['WORKSTAT'] == 10 or  item['WORKSTAT'] == 13:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

# fin_work = fincpByWorkstat(data)
# print fin_work[0:20]
# print len(randomsample), randomsample[10]
# print fin_work
@app.route("/fincpbyhouse1")
def byHouse1Data():
    return result_data['fincpbyhouse1']

def fincpByHouse1():
    dataset =  data
    bin = []
    for item in dataset:
        if item['BLD'] == 1:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbyhouse2")
def byHouse2Data():
    return result_data['fincpbyhouse2']

def fincpByHouse2():
    dataset =  data
    bin = []
    for item in dataset:
        if item['BLD'] == 2:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbyhouse3")
def byHouse3Data():
    return result_data['fincpbyhouse3']

def fincpByHouse3():
    dataset =  data
    bin = []
    for item in dataset:
        if item['BLD'] == 3:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)

@app.route("/fincpbyhouse4")
def byHouse4Data():
    return result_data['fincpbyhouse4']


def fincpByHouse4():
    dataset =  data
    bin = []
    for item in dataset:
        if item['BLD'] == 4 or item['BLD'] == 5 or item['BLD'] == 6 or item['BLD'] == 7 or item['BLD'] == 8 or item['BLD'] == 9:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)


@app.route("/fincpbyhouse5")
def byHouse5Data():
    return result_data['fincpbyhouse5']

def fincpByHouse5():
    dataset =  data
    bin = []
    for item in dataset:
        if item['BLD'] == 10:
            bin.append(item)
    return json.dumps(bin, default=json_util.default)


result_data = {}
result_data['origin'] = getData()
result_data['fincpbywork1'] = fincpByWorkstat1()
result_data['fincpbywork2'] = fincpByWorkstat2()
result_data['fincpbywork3'] = fincpByWorkstat3()
result_data['fincpbywork4'] = fincpByWorkstat4()
result_data['fincpbywork5'] = fincpByWorkstat5()
result_data['fincpbyhouse1'] = fincpByHouse1()
result_data['fincpbyhouse2'] = fincpByHouse2()
result_data['fincpbyhouse3'] = fincpByHouse3()
result_data['fincpbyhouse4'] = fincpByHouse4()
result_data['fincpbyhouse5'] = fincpByHouse5()


def randSample(dataset,resultNum):
    if resultNum > len(dataset):
        return dataset
    result_data = []
    tempData = copy.deepcopy(dataset)
    for i in range(resultNum):
        idx = random.randint(0,len(tempData) - 1)
        result_data.append(tempData.pop(idx).values())
    return result_data
pca_data = randSample(origin_data, 1000)

# def adaptiveSample(dataset,resultNum):
#     if resultNum > len(dataset):
#         return dataset
#     tempData  = []
#     for item in dataset:
#         tempData.append(item.values())
#     array = numpy.array(tempData,dtype=float)
#     print array
#     [centroid,labels] = scipy.cluster.vq.kmeans2(array, 10, minit='points')
#     clusters = []
#     samples = []
#     for i in range(10):
#         clusters.append([])
#     for i in range(len(dataset)):
#         clusters[labels[i]].append(tempData[i])
#     mod = resultNum % 10
#     subNum = int(math.floor(resultNum / 10))
#     for i in range(10):
#         if mod > 0:
#             samples.extend(randSample2(clusters[i],subNum + 1))
#             mod -= 1
#         else:
#             samples.extend(randSample2(clusters[i],subNum))
#     return samples
#
# def randSample2(dataset,resultNum):
#     if resultNum > len(dataset):
#         return dataset
#     result_data = []
#     tempData = copy.deepcopy(dataset)
#     for i in range(resultNum):
#         idx = random.randint(0,len(tempData) - 1)
#         result_data.append(tempData.pop(idx))
#     return result_data


@app.route("/pca")
def pca():
    return render_template("pca.html")

@app.route("/pcaData")
def getPCAData():
    return dumps(temp_data)

def doPCA9(dataset):
    array = numpy.array(dataset,dtype=float)
    pca = sklearn.decomposition.PCA(n_components = 9)
    pca.fit(array)
    return pca.explained_variance_ratio_

def doPCA(dataset):
    array = numpy.array(dataset,dtype=float)
    pca = sklearn.decomposition.PCA(n_components = 2)
    pca.fit(array)
    return pca.transform(array)

def doMDS(data,type = "euclidean"):
    array = numpy.array(data,dtype=float)
    dis_mat = sklearn.metrics.pairwise_distances(array,metric=type)
    mds = sklearn.manifold.MDS(n_components=2, dissimilarity='precomputed')
    return mds.fit_transform(dis_mat)

def doISOMAP(data):
    array = numpy.array(data,dtype=float)
    mds = sklearn.manifold.Isomap(n_components=2)
    return mds.fit_transform(array)

temp_data = {}
temp_data['dim_ratios'] = doPCA9(pca_data)
temp_data['data_pca'] = doPCA(pca_data)
temp_data['data_mds'] = doMDS(pca_data,'euclidean')
temp_data['data_isomap'] = doISOMAP(pca_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)