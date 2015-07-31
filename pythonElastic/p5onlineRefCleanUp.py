import json
from pprint import pprint

with open("p5onlineRef.json") as f:
	data = json.load(f)

js = data["ref"]

di = {}

noMethods = []
count = 0
for i in js:
	if 'name' in i.keys(): #if it has a name then its a public method/property
		if i["itemtype"] == "method": #if its a method create a syntax string for it using the params
			if 'params' in i.keys():
				syntax = i["name"] + "("
				for p in i["params"]:
					param_name = p["name"]
					if 'optional' in p.keys():
						param_name = "["+param_name+"]"
					syntax += param_name +","
				if(syntax[-1]==","):
					syntax = syntax[:-1]
				syntax += ")"
				i["syntax"]= syntax
			else:
				i["syntax"]=i["name"]+"()"
				#print i["name"], i["syntax"]
		elif i["itemtype"] == "property": #if its a property syntax = name
			i["syntax"] = i["name"]
			#print i["syntax"]
		

# check why you have to do this so many times to get rid of all the dicts without a name value - is it cuz of the reducing index
for j in range(5):
	for j in js:
		try:
			j["name"]
		except KeyError:
			print "Removing"
			count +=1
			js.remove(j)

#not setting all in main loop - why

print "NOO SYNTAXXX"
for h in js:
	if h["itemtype"] == "property":
		print h["name"]
		h["syntax"] = h["name"]
		
# add arrays for + and - questions to improve elastic search ranking
print "ADDING QUESTION ARRAYS"
for f in js:
	f["positive_questions"]=[]
	f["negative_questions"]=[]

print count

di["ref"] = js
#pprint(js)
#pprint(json.dumps(di, sort_keys=True))
print "NOOO SYNTAXXX"
for c in js:
	if 'syntax' not in c.keys():
		stri = c['name'] + " " + c['itemtype']
		if 'params' in c.keys():
			stri += "PARAMS"
		print stri

with open('p5Cleaned.json', 'w') as outFile:
	json.dump(di, outFile)
