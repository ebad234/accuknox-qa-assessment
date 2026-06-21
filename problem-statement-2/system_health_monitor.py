import psutil
from datetime import datetime
from pathlib import Path

# ==================================================
# CONFIGURATION: ALERT THRESHOLDS
# ==================================================
CPU_THRESHOLD = 80
MEMORY_THRESHOLD = 80
DISK_THRESHOLD = 80

# Log file will be created in the same folder as this script
LOG_FILE = Path(__file__).parent / "system_health.log"


def write_log(message):
    """Print a message to the console and save it to a log file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    final_message = f"[{timestamp}] {message}"

    print(final_message)

    with open(LOG_FILE, "a", encoding="utf-8") as log_file:
        log_file.write(final_message + "\n")


def get_top_processes(limit=5):
    """
    Get top running processes sorted by CPU usage.
    CPU percentage needs a small interval to calculate correctly.
    """
    process_list = []

    # First call initializes CPU measurement for processes
    for process in psutil.process_iter(["pid", "name"]):
        try:
            process.cpu_percent(None)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    # Wait briefly so CPU usage can be measured
    psutil.cpu_percent(interval=1)

    # Collect process information
    for process in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_percent"]
    ):
        try:
            process_info = process.info

            process_list.append(
                {
                    "pid": process_info["pid"],
                    "name": process_info["name"] or "Unknown",
                    "cpu_percent": process.cpu_percent(None),
                    "memory_percent": process_info["memory_percent"] or 0,
                }
            )
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    return sorted(
        process_list,
        key=lambda item: item["cpu_percent"],
        reverse=True,
    )[:limit]


def check_cpu_usage():
    """Check CPU usage and print alert if it crosses the threshold."""
    cpu_usage = psutil.cpu_percent(interval=1)

    write_log(f"CPU Usage: {cpu_usage}%")

    if cpu_usage > CPU_THRESHOLD:
        write_log(
            f"ALERT: CPU usage is above the {CPU_THRESHOLD}% threshold."
        )


def check_memory_usage():
    """Check memory usage and print alert if it crosses the threshold."""
    memory = psutil.virtual_memory()

    write_log(
        f"Memory Usage: {memory.percent}% "
        f"({memory.used / (1024 ** 3):.2f} GB used "
        f"of {memory.total / (1024 ** 3):.2f} GB)"
    )

    if memory.percent > MEMORY_THRESHOLD:
        write_log(
            f"ALERT: Memory usage is above the {MEMORY_THRESHOLD}% threshold."
        )


def check_disk_usage():
    """Check C drive disk usage on Windows."""
    disk = psutil.disk_usage("C:\\")

    write_log(
        f"Disk Usage (C:): {disk.percent}% "
        f"({disk.used / (1024 ** 3):.2f} GB used "
        f"of {disk.total / (1024 ** 3):.2f} GB)"
    )

    if disk.percent > DISK_THRESHOLD:
        write_log(
            f"ALERT: Disk usage is above the {DISK_THRESHOLD}% threshold."
        )


def check_running_processes():
    """Display the top 5 processes using the most CPU."""
    write_log("Top 5 Running Processes by CPU Usage:")

    top_processes = get_top_processes()

    if not top_processes:
        write_log("No process information could be collected.")
        return

    for process in top_processes:
        write_log(
            f"PID: {process['pid']} | "
            f"Name: {process['name']} | "
            f"CPU: {process['cpu_percent']:.2f}% | "
            f"Memory: {process['memory_percent']:.2f}%"
        )


def check_system_health():
    """Run all Linux/Windows system health checks."""
    write_log("========== SYSTEM HEALTH MONITOR STARTED ==========")

    check_cpu_usage()
    check_memory_usage()
    check_disk_usage()
    check_running_processes()

    write_log("========== SYSTEM HEALTH MONITOR FINISHED ==========\n")


if __name__ == "__main__":
    check_system_health()