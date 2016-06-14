title: Monitoring
layout: plain
---

In operations we build and maintain systems.  The key task of maintaining infrastructure is making sure it is available and working optimally.  Monitoring our systems serves a few different purposes:

1. Alerting when services are malfunctioning or malfunction is imminent.
  Malfunctioning can take a few different forms:
  * A service is down -- completely unavailable.
  * A service has a high error rate: it fails to respond to some requests.
  * A service responds slowly i.e. has a high [latency](/glossary/latency.html)
  * A service is about to run out of resources, like disk space.

2. Monitoring to measure the current SLO (Service Level Objective)

3. Historical data for troubleshooting.
  This can be in the form of:
  * Time Series Data/Graphs
  * Logs