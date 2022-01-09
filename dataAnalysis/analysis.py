#print("start here")
import matplotlib.pyplot as plt
import os

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
  fig = plt.bar(list(keyDict.keys()), keyDict.values(), color='g')
  plt.xticks(rotation = 90)
  plt.savefig('./Documents/Github/SequencerLiveCoding/dataAnalysis/keyAnalysis.png')
  plt.show()

#a function to analyse time between click events
def timeAnalysis():
 for folder in my_list:
  with open(path + '/' + folder + '/log.txt') as f:
   substringClick = " clickEvent"
   timeList = []
   count = 0
   for lines in f:
     count += 1
     print(count)
     print(folder)

     #sorted_line is not used anywhere but allows us to use the for loop
     line1 = lines.split(',')
     l2 = f.readline()
     line2 = l2.split(',')
     #print('current_line' + str(line2))
     #print ('prev_line' + str(line1))
     if not l2.strip(): 
      break
     elif line1[2] == substringClick and line2[2] == substringClick:
      #print('current_line' + str(sorted_line2))
      #print ('prev_line' + str(sorted_line1))
      timeNext = int(float(line2[4]))
      roundTimeNext = round(timeNext)
      timeCurr = int(float(line1[4]))
      roundTimeCurr = round(timeCurr)
      average_time = roundTimeNext - roundTimeCurr
      #print(str(roundTimeCurr) + " " + str(roundTimeNext) + " " + str(average_time))
      timeList.append(average_time)
      size = len(timeList)
      print("av time = " + str(average_time))
      print(size)
     
      

def eventEvolv():
 countClick = 0
 countKey = 0
 for folder in my_list:
  with open(path + '/' + folder + '/log.txt') as f: 
    for line in f:
      sort_line = line.split(',')

#countEvents()
#keyAnalysis()
timeAnalysis()
      


   