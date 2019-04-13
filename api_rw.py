from flask import Flask
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
api = Api(app)

weather = {}
with open('seattle-temps.csv', 'r') as f:
	data = f.readlines()

for item in data[1:]:
    date = item.split(",")[0].strip("\n")
    temp = item.split(",")[1].strip("\n")
    year, month, day = date.split("/")
    day, time = day.split(" ")
    if year not in weather:
        weather[year] = {}
    if month not in weather[year]:
        weather[year][month] = {}
    if day not in weather[year][month]:
        weather[year][month][day] = {}
    weather[year][month][day][time] = temp

		
def abort_if_date_doesnt_exist(year, month = None, day = None, time = None):
	if year not in weather.keys():
		abort(404, message = "Wrong Date")
	elif month is not None and month not in weather[year].keys():
		abort(404, message = "Wrong Date")
	elif day is not None and day not in weather[year][month].keys():
		abort(404, message = "Wrong Date")
	elif time is not None and time not in weather[year][month][day].keys():
		abort(404, message = "Wrong Date")

parser = reqparse.RequestParser()
parser.add_argument('task')

class Weather(Resource):
	def get(self):
		return weather

class Year(Resource):
	def get(self, year):
		abort_if_date_doesnt_exist(str(year))
		return weather[str(year)]
		
class Month(Resource):
	def get(self, year, month):
		abort_if_date_doesnt_exist(str(year), str(month))
		return weather[str(year)][str(month)]
		
class Day(Resource):
	def get(self, year, month, day):
		abort_if_date_doesnt_exist(str(year), str(month), str(day))
		return weather[str(year)][str(month)][str(day)]
		
class Time(Resource):
	def get(self, year, month, day, time):
		abort_if_date_doesnt_exist(str(year), str(month), str(day), str(time))
		return weather[str(year)][str(month)][str(day)][str(time)]


api.add_resource(Weather, "/weather")
api.add_resource(Year, "/weather/<year>")
api.add_resource(Month, "/weather/<year>/<month>")
api.add_resource(Day, "/weather/<year>/<month>/<day>")
api.add_resource(Time, "/weather/<year>/<month>/<day>/<time>")

if __name__ == '__main__':
    app.run(debug=True)