library(plyr)
library(dplyr)
library(car)
library(tidyr)
library(reshape)
library(psych)
library(magrittr)

rm(list=ls())
#Set wd to location where you are storing files for this task 
origwd <- getwd()
s <- Sys.Date()
dir.create(file.path(paste0(origwd,"/",s)))
setwd(paste0(origwd,"/",s))
options(timeout=40000)
getOption("timeout")

#Get experimentName and database (server) from settings file
experigen.experimentName = "testident"
experigen.database = "http://db.phonologist.org/"
#Must retrieve sourceURL from the settings file!
#Actual URL may have different formatting--must use settings version
#Paste and substitute slashes, tildes, etc. with periods
experigen.sourceURL = "https...s3.amazonaws.com.experigendata.testexperigen.web.nsidentindex.html"

# check for usage of the experiment (number of page views per participant)
experigen.users  =  paste(experigen.database, "users.cgi?experimentName=", 
                          experigen.experimentName, "&sourceurl=", experigen.sourceURL, sep="")
download.file(experigen.users, "users.csv") 
users = read.csv("users.csv", sep="\t")

# read the experimental results from the server
experigen.url  =  paste(experigen.database, "makecsv.cgi?experimentName=", 
                        experigen.experimentName, "&sourceurl=", experigen.sourceURL, sep="")
download.file(experigen.url, destfile = "./xp.csv")
download.file(paste(experigen.url, "&file=demographics.csv", sep=""),"demographics.csv")
#xp  = read.csv("xp.csv", sep=",")
xp  = read.csv("xp.csv", sep="\t")
#meta = read.csv("demographics.csv", sep=",")
meta = read.csv("demographics.csv", sep="\t")
#which(meta$userCode=="")
levels(xp$view)

# setting new tables
# views -- table of views and n's
(views = ddply(xp, .(view), summarise, n=length(view)))
xp.train = subset(xp,view=="training_vas_TGF.ejs")
#xp.elig = subset(xp,view=="eligibility.ejs")
xp.stim = subset(xp,view=="stimulus_vas_TGF.ejs")
#xp.catch = subset(xp,view=="catch.ejs")


#Add identifier (using headphones for testing)
ID <- dplyr::select(meta, headphones, userCode)
elig <- left_join(elig, ID, by="userCode")

getwd()
write.csv(elig,"eligibilitydec.csv")
#write.csv(xp, "xp.csv")
#write.csv(meta, "demographics.csv")
write.csv(xp.train, "xp_train.csv")
write.csv(xp.stim, "xp_stim.csv")


