# Logging

In a large production network, if you are not doing centralized logging, you're doing it wrong.  Applications and servers send thousands of log messages, and the centralized logging allows you to detect problems in a central location(without logging into a server to have to see it) correlate related issues, raise visibility about systemic issues(i.e. seeing if a log is happening on multiple servers simultaneously or just on the one you see the log on).

Traditional central logging solutions generally involve 

## ELK (Elasticsearch, Logstash, Kibana)

ELK is a great, fast, flexible, open source logging solution, but the reality is at scale your mileage will vary.  Storing and retrieving lots of data quickly is a hard problem.  If you're trying to gather data form about a hundred nodes, you'll probably be fine.  But if you're trying to run it at a large scale company, you'll likely have issues.  This doesn't mean you shouldn't use it.  It's much faster to search through logs than traditional flat file logging solutions.  But know you'll likely have problems.  

ELK's problems are global to engineering solutions like this.   There's no such thing as a free lunch, and there's no magic bullet to large scale logging at scale.  


More information about ELK can be found at [http://www.elastic.org](http://www.elastic.org)

Contributors: @mikkergimenez
