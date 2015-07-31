from elasticsearch import Elasticsearch
import json

es = Elasticsearch()

with open('p5Cleaned.json') as f:
	data = json.load(f)

es.indices.create(index='languages', ignore=400)

js = data["ref"]
count = 0
#add each doc to es index
for i in js:
	count += 1
	print "Indexing: " + str(count)
	es.index(index="languages", doc_type="p5", body=i)