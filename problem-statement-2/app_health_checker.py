import requests
from datetime import datetime
from pathlib import Path

# ==================================================
# CONFIGURATION
# ==================================================
URLS_TO_CHECK = [
    "https://opensource-demo.orangehrmlive.com/",
    "https://www.google.com/",
    "https://httpstat.us/500",
]

TIMEOUT_SECONDS = 15
LOG_FILE = Path(__file__).parent / "application_health.log"


def write_log(message):
    """Print a message and save it in the application health log."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    final_message = f"[{timestamp}] {message}"

    print(final_message)

    with open(LOG_FILE, "a", encoding="utf-8") as log_file:
        log_file.write(final_message + "\n")


def check_application(url):
    """Check whether a URL is reachable and returns a successful response."""
    try:
        start_time = datetime.now()

        response = requests.get(
            url,
            timeout=TIMEOUT_SECONDS,
            allow_redirects=True,
        )

        end_time = datetime.now()
        response_time_ms = (end_time - start_time).total_seconds() * 1000

        if 200 <= response.status_code < 400:
            write_log(
                f"HEALTHY | URL: {url} | "
                f"Status Code: {response.status_code} | "
                f"Response Time: {response_time_ms:.2f} ms"
            )
        else:
            write_log(
                f"UNHEALTHY | URL: {url} | "
                f"Status Code: {response.status_code} | "
                f"Response Time: {response_time_ms:.2f} ms"
            )

    except requests.exceptions.Timeout:
        write_log(
            f"UNHEALTHY | URL: {url} | "
            f"Reason: Request timed out after {TIMEOUT_SECONDS} seconds"
        )

    except requests.exceptions.RequestException as error:
        write_log(
            f"UNHEALTHY | URL: {url} | "
            f"Reason: {error}"
        )


def run_health_checks():
    """Run health checks for all configured application URLs."""
    write_log("========== APPLICATION HEALTH CHECK STARTED ==========")

    for url in URLS_TO_CHECK:
        check_application(url)

    write_log("========== APPLICATION HEALTH CHECK FINISHED ==========\n")


if __name__ == "__main__":
    run_health_checks()