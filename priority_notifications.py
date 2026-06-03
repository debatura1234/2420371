import json
import logging
import urllib.request
from datetime import datetime
from functools import wraps
from typing import Any, Callable, Dict, List

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

TYPE_WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1,
    "placement": 3,
    "result": 2,
    "event": 1,
}

API_URL = "http://4.224.186.213/evaluation-service/notification"


def logging_middleware(func: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        logging.info("Entering: %s", func.__name__)
        result = func(*args, **kwargs)
        logging.info("Exiting: %s", func.__name__)
        return result

    return wrapper


@logging_middleware
def parse_timestamp(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")


@logging_middleware
def load_hardcoded_notifications() -> List[Dict[str, str]]:
    return [
        {
            "ID": "d146095a-0d86-aa34-9e69-3g00a14576bc",
            "Type": "Result",
            "Message": "mid-sem result available",
            "Timestamp": "2026-05-05 16:22:00",
        },
        {
            "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
            "Type": "Placement",
            "Message": "CSX Corporation hiring",
            "Timestamp": "2026-05-06 09:10:15",
        },
        {
            "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d",
            "Type": "Event",
            "Message": "farewell ceremony announced",
            "Timestamp": "2026-05-04 14:00:00",
        },
        {
            "ID": "f16c7b73-48d7-4998-8e62-ff3fbe53a6db",
            "Type": "Placement",
            "Message": "Campus drive: Nimbus Labs",
            "Timestamp": "2026-05-06 12:35:22",
        },
        {
            "ID": "e5a9342c-7d98-4010-b911-0b7a10b6c428",
            "Type": "Result",
            "Message": "project grades published",
            "Timestamp": "2026-05-05 17:45:00",
        },
        {
            "ID": "95dc8a25-7dcd-4ef7-8298-c99f4f704f7f",
            "Type": "Event",
            "Message": "guest lecture on AI",
            "Timestamp": "2026-05-06 11:00:00",
        },
        {
            "ID": "31b4ccae-4dde-4d6e-a1dc-019db88926b1",
            "Type": "Placement",
            "Message": "Internship drive: TekNova",
            "Timestamp": "2026-05-06 09:00:00",
        },
        {
            "ID": "d1fb0d61-9984-4fef-b279-0f3d4b9dc04d",
            "Type": "Result",
            "Message": "final semester marks released",
            "Timestamp": "2026-05-06 08:30:00",
        },
        {
            "ID": "4b9f6b1e-30c4-4c5d-b2ee-2b05c720b5b0",
            "Type": "Event",
            "Message": "club fair tomorrow",
            "Timestamp": "2026-05-05 09:00:00",
        },
        {
            "ID": "7a1c864d-01a2-4341-8133-fdb7f0739d7d",
            "Type": "Placement",
            "Message": "Leadership summit application open",
            "Timestamp": "2026-05-05 18:20:30",
        },
        {
            "ID": "2fe6b432-4d02-4ff6-8c14-451ea2a07a4e",
            "Type": "Result",
            "Message": "extra credit assignment outcome",
            "Timestamp": "2026-05-04 10:15:00",
        },
        {
            "ID": "a5c95d12-4f15-4b21-a950-1c2ee5d9523d",
            "Type": "Event",
            "Message": "sports meet schedule",
            "Timestamp": "2026-05-06 07:45:00",
        },
        {
            "ID": "bc9e5d85-5c6f-4e2f-b808-7d3f22f30d96",
            "Type": "Placement",
            "Message": "FastTrack apprenticeship opening",
            "Timestamp": "2026-05-06 13:05:40",
        },
        {
            "ID": "edf73722-e4fd-4b82-a9de-d8493324b5aa",
            "Type": "Result",
            "Message": "lab practical results available",
            "Timestamp": "2026-05-06 08:10:10",
        },
        {
            "ID": "8c6f8a69-4d89-4f53-9d73-0bd523b1fc0a",
            "Type": "Event",
            "Message": "movie night invitation",
            "Timestamp": "2026-05-05 20:00:00",
        },
    ]


@logging_middleware
def fetch_notifications_from_api() -> List[Dict[str, str]]:
    try:
        with urllib.request.urlopen(API_URL, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
            if isinstance(data, dict) and "notifications" in data:
                return data["notifications"]
            raise ValueError("Unexpected API response format")
    except Exception as exc:
        logging.warning("API fetch failed, using hardcoded notifications: %s", exc)
        return []


@logging_middleware
def score_notification(notification: Dict[str, str]) -> int:
    type_name = notification.get("Type", "Event")
    base_weight = TYPE_WEIGHTS.get(type_name, TYPE_WEIGHTS.get(type_name.capitalize(), 1))
    timestamp = parse_timestamp(notification["Timestamp"])
    recency_score = int(timestamp.timestamp())
    return base_weight * 10**12 + recency_score


@logging_middleware
def prioritize_notifications(notifications: List[Dict[str, str]], top_n: int = 10) -> List[Dict[str, str]]:
    sorted_notifications = sorted(
        notifications,
        key=lambda item: (
            TYPE_WEIGHTS.get(item.get("Type", "Event"), 1),
            parse_timestamp(item["Timestamp"]),
        ),
        reverse=True,
    )
    return sorted_notifications[:top_n]


@logging_middleware
def print_notifications(notifications: List[Dict[str, str]]) -> None:
    print("Top priority notifications:")
    print("---------------------------")
    for idx, notification in enumerate(notifications, start=1):
        print(
            f"{idx}. [{notification['Type']}] {notification['Message']} "
            f"(ID: {notification['ID']}, Timestamp: {notification['Timestamp']})"
        )


def main() -> None:
    notifications = fetch_notifications_from_api()
    if not notifications:
        notifications = load_hardcoded_notifications()

    top_notifications = prioritize_notifications(notifications, top_n=10)
    print_notifications(top_notifications)


if __name__ == "__main__":
    main()
