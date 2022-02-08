#print("start here")
import matplotlib.pyplot as plt
import os
import plotly.figure_factory as ff
import pandas as pd

path = './Documents/Github/SequencerLiveCoding/dataAnalysis/csc_workshop_12_4_2021/logs/TBR'
my_list = os.listdir(path)

#function to find the ratio of keyEvents to clickEvents
def countEvents():
  countClick = 0
  countKey = 0
  #count = 0
  for folderName in my_list:
      with open(path + '/' + folderName + '/log.txt') as f:
      #below are some checks if something is not working - count will count the number of folders being accessed by the function (should be 111)
        #count += 1
        #print(count)
        #print(folderName)
        line = f.read()
        countClick += line.count('clickEvent')
        countKey += line.count('keyEvent')
        #print(line)      
  print('total number of click Events = ' + str(countClick))
  print('total number of key Events = ' + str(countKey))
  clickRatio = countClick/(countKey+countClick)
  keyRatio = 1 - clickRatio
  print('the ratio of click Events to Key events is ' + str(round(clickRatio*100)) + ':' + str(round(keyRatio* 100)))

#a function to analyse the keyEvents
def keyAnalysis():
  #a dictionary of keys
  keyDict = {}
  #initial value to assign to a key in dictionary
  valCol = 1
  for folder in my_list:
    with open(path + '/' + folder + '/log.txt') as f:
        #specification check for keyEvents only
          substringKey = " keyEvent"
          for lines in f:
              s_line = lines.split(',')
              #print("!" + s_line[2]+ "!")
              #loop for all keyEvents
              #print(s_line[2] == substringKey)
              if (s_line[2] ==substringKey):
              #print('i work')
              #if dictionary already contains the key, update value
                if (s_line[3] in keyDict):
                    val = keyDict[s_line[3]]
                    newVal = val + 1 
                    v ={s_line[3]: newVal }
                    keyDict.update(v)
                    #else create a new value and assign key 1
                else:
                    v ={s_line[3]: valCol }
                    keyDict.update(v)
  print(keyDict)
  size = len(keyDict)
  print(size)
  data = {'KeyEvent':keyDict.keys(), 'Count' : keyDict.values()}
  df1 = pd.DataFrame(data, columns=['KeyEvent','Count'])
  df1 = df1.sort_values(by=['Count'], ascending=False)
  print(df1)
  fig = ff.create_table(df1)
  fig.update_layout(
    autosize=False,
    width=500,
    height=1000,
  )
  fig.write_image("Key_Freq.png", scale=2)
  fig.show()
  fig = plt.bar(list(keyDict.keys()), keyDict.values(), color='g')
  plt.xticks(rotation = 90)
  plt.savefig('./Documents/Github/SequencerLiveCoding/dataAnalysis/keyAnalysis.png')
  plt.show()

#a function to analyse time between click events, using timeGenDict, a 'set' of time calculated between click events and timeDict, a dictionary recording the 
#time with frequency
def timeAnalysis():
 #count = 0
 timeSet = set()
 timeGenDict = {}
 timeDict = {}
 valTime = 1
 for folder in my_list:
    with open(path + '/' + folder + '/log.txt') as f:
      substringClick = " clickEvent"
      #count += 1
      for lines in f:
        #general checks to see if the functions reads through all folders - should total 111
        #print(count)
        #print(folder)

        line1 = lines.split(',')
        l2 = f.readline()
        line2 = l2.split(',')
        #print('current_line' + str(line2))
        #print ('prev_line' + str(line1))
        if not l2.strip(): 
          break
        elif line1[2] == substringClick and line2[2] == substringClick:
          timeNext = int(float(line2[4]))
          roundTimeNext = round(timeNext)
          timeCurr = int(float(line1[4]))
          roundTimeCurr = round(timeCurr)
          average_time = roundTimeNext - roundTimeCurr
          avTimeSec = average_time/1000
          roundTime = round(avTimeSec)
          #print("av time = " + str(roundTime))
        
          #add time difference to a set to remove duplicates then add to a dictionary using indices as keys
          timeSet.add(roundTime)
          #timeGenDict = {k: v for v, k in enumerate(timeSet)}
          timeGenDict = {i : 1 for i in timeSet }

          # add time difference to a dictionary, if dictionary already contains the key, update value
          if (roundTime in timeDict):
            val = timeDict[roundTime]
            newVal = val + 1 
            v ={roundTime: newVal }
            timeDict.update(v)
          #else create a new value and assign key 1
          else:
            v ={roundTime: valTime }
            timeDict.update(v)
 #print(timeDict)
 #print (timeGenDict)
 data = {'Time(sec)':timeDict.keys(), 'Count' : timeDict.values()}
 df1 = pd.DataFrame(data, columns=['Time(sec)','Count'])
 df1 = df1.sort_values(by=['Count'], ascending=False)
 print(df1)
 fig = ff.create_table(df1)
 fig.update_layout(
    autosize=False,
    width=500,
    height=800,
  )
 fig.write_image("table_plotly.png", scale=2)
 fig.show()
 fig2 = plt.bar(list(timeGenDict.keys()), timeGenDict.values(), color='g')
 plt.xticks(rotation = 90)
 plt.xlim([0,200])
 plt.savefig('./Documents/Github/SequencerLiveCoding/dataAnalysis/Data analysis reports/generalTime.png')
 plt.show()

def eventEvolv():
 clickOnly = 0
 keyOnly = 0
 both = 0
 count = 0
 events = []
 for folder in my_list:
    with open(path + '/' + folder + '/log.txt') as f: 
      countClick = 0
      countKey = 0
      count+=1
      for line in f:
        #print(count)
        #print(folder)
        countClick += line.count('clickEvent')
        countKey += line.count('keyEvent')
      #print('clicks' + " " + str(countClick))
      #print('keys' + " " + str(countKey))
      if countClick == 0:
        keyOnly+=1
      elif countKey == 0:
        clickOnly+=1
      else : both+=1
 print('key' + " " + str(keyOnly))
 print('click' + " " + str(clickOnly))
 print('both' + " " + str(both))
 events.insert(0, keyOnly)
 events.insert(1, clickOnly)
 events.insert(2, both)
 my_labels = 'keyOnly','clickOnly','Both'
 plt.pie(events,labels=my_labels,autopct='%1.1f%%')
 plt.title('Events per single user')
 plt.axis('equal')
 plt.savefig('./Documents/Github/SequencerLiveCoding/dataAnalysis/Data analysis reports/userEvents.png')
 plt.show()


#countEvents()
#keyAnalysis()
#timeAnalysis()
eventEvolv()

      


   