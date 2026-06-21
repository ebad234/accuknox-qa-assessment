# AccuKnox Problem Statement 2 - Python Automation Scripts

## Overview

This project contains two Python automation scripts created for Problem Statement 2.

## Objectives Implemented

### 1. System Health Monitoring Script

The `system_health_monitor.py` script monitors local Windows system health.

It performs the following checks:

* CPU usage monitoring
* Memory usage monitoring
* C: drive disk usage monitoring
* Top 5 running processes by CPU usage
* Alerts when CPU, memory, or disk usage exceeds 80%
* Saves output to `system_health.log`

### 2. Application Health Checker

The `app_health_checker.py` script checks whether configured web applications are reachable.

It performs the following checks:

* Sends HTTP requests to configured URLs
* Checks HTTP response status codes
* Measures response time
* Marks applications as HEALTHY or UNHEALTHY
* Handles timeout and connection errors
* Saves output to `application_health.log`

## Project Structure

```text
problem-statement-2/
├── system_health_monitor.py
├── app_health_checker.py
├── requirements.txt
├── README.md
├── system_health.log
└── application_health.log
```

## Prerequisites

* Python 3.13 or higher
* Internet connection

## Installation Steps

1. Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

2. Move into the project folder:

```bash
cd problem-statement-2
```

3. Install dependencies:

```bash
py -m pip install -r requirements.txt
```

## Required Python Packages

```text
psutil
requests
```

## How to Run the Scripts

### Run System Health Monitor

```bash
py system_health_monitor.py
```

### Run Application Health Checker

```bash
py app_health_checker.py
```

## Output Files

The scripts automatically create log files in the same folder:

* `system_health.log`
* `application_health.log`

## Example Health Check Result

```text
HEALTHY | URL: https://opensource-demo.orangehrmlive.com/ | Status Code: 200
UNHEALTHY | URL: https://httpstat.us/500 | Reason: Connection or server error
```
