# Imports
from flask import Flask,request,jsonify,render_template
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import string
import random
import os
import jinja2
from langchain_community.tools.pubmed.tool import PubmedQueryRun
from langchain_community.document_loaders.csv_loader import CSVLoader
from huggingface_hub.hf_api import HfFolder
from langchain_community.document_loaders import PubMedLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import pickle
import json
import openai


# Configs
app = Flask(__name__)
HfFolder.save_token('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')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# ROUTES



# Landing Page UI Route
@app.route("/")
def client():
    return render_template('index.html')



    
#Query API Rotue 
@app.route('/query',methods = ['POST'])
@cross_origin()
def getQuery():
    # Query get from request
    data = request.get_json()
    query = data['query']
    
    # Pubmed Retriver and Docs Loading 
    loader = PubMedLoader(query)
    docs = loader.load()
    context = "\n\n".join( doc.page_content for doc in docs)
    if(len(docs) == 0):
       return {
       context : "No relevent Information found",
       meta_data : "Check Spelling and try again"
    }
       
   #  return {
   #     "context" :  docs[0].page_content,
   #     "title" : docs[0].metadata
   #  }
    
    
    # Use CHAT GPT for Generating Graphs
    prompt_template = "study the given context : " + context + """
    You are an React developer who know to code React-vis-network-graph. on based of the context provided make a graph network of the relationship and association of elements in context
    create a network graph of this and return the graph object with nodes and edges as json object
    """

    response = openai.chat.completions.create(
     model="gpt-4-turbo",
     messages=[{"role": "user", "content": prompt_template}],
     response_format={ "type": "json_object" }
     )
    
    return {
       "context" :  docs[0].page_content,
       "title" : docs[0].metadata,
       "code" : response.choices[0].message.content
    }
 
 

#  Run Server 
if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
    app.run()