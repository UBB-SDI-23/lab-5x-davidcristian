import csv
import random
from enum import Enum
from faker import Faker
from multiprocessing import Process

fake = Faker()
MIN_ROLE_LEVEL = 1
MAX_ROLE_LEVEL = 100

EMPLOYEE_ROLES_COUNT = 1_000_000
EMPLOYEES_COUNT = 1_000_000
STORES_COUNT = 1_000_000
STORE_SHIFTS_COUNT = 10_000_000


class Gender(Enum):
    Female = 0
    Male = 1
    Other = 2


class StoreCategory(Enum):
    General = 0
    Food = 1
    Clothing = 2
    Electronics = 3
    Furniture = 4


def create_employee_roles_csv():
    print("Begin create_employee_roles_csv")

    with open("employee_roles.csv", "w", newline="") as f:
        writer = csv.writer(f)

        for i in range(1, EMPLOYEE_ROLES_COUNT + 1):
            role_name = fake.job()
            role_desc = f"{role_name} description"
            role_level = random.randint(MIN_ROLE_LEVEL, MAX_ROLE_LEVEL)

            writer.writerow([i, role_name, role_desc, role_level])

    print("End create_employee_roles_csv")


def create_employees_csv():
    print("Begin create_employees_csv")
    genders = list(Gender)

    with open("employees.csv", "w", newline="") as f:
        writer = csv.writer(f)

        for i in range(1, EMPLOYEES_COUNT + 1):
            first_name = fake.first_name()
            last_name = fake.last_name()
            gender = random.choice(genders).value
            employment_date = fake.date_between(start_date="-10y", end_date="today")
            termination_date = (
                fake.date_between(start_date=employment_date, end_date="today")
                if random.random() < 0.2
                else None
            )
            salary = round(random.uniform(30000, 120000), 2)
            role_id = random.randint(1, EMPLOYEE_ROLES_COUNT)

            writer.writerow(
                [
                    i,
                    first_name,
                    last_name,
                    gender,
                    employment_date,
                    termination_date,
                    salary,
                    role_id,
                ]
            )

    print("End create_employees_csv")


def create_stores_csv():
    print("Begin create_stores_csv")
    categories = list(StoreCategory)

    with open("stores.csv", "w", newline="") as f:
        writer = csv.writer(f)

        for i in range(1, STORES_COUNT + 1):
            store_name = f"{fake.company()} Store"
            store_desc = f"{store_name} description"
            category = random.choice(categories).value
            address = fake.street_address()
            city = fake.city()
            state = fake.state_abbr()
            zip_code = fake.zipcode()
            country = fake.country()
            open_date = fake.date_between(start_date="-20y", end_date="today")
            close_date = (
                fake.date_between(start_date=open_date, end_date="today")
                if random.random() < 0.1
                else None
            )

            writer.writerow(
                [
                    i,
                    store_name,
                    store_desc,
                    category,
                    address,
                    city,
                    state,
                    zip_code,
                    country,
                    open_date,
                    close_date,
                ]
            )

    print("End create_stores_csv")


def create_store_shifts_csv():
    print("Begin create_store_shifts_csv")

    unique_shifts = set()
    for _ in range(STORE_SHIFTS_COUNT):
        while True:
            store_id = random.randint(1, STORES_COUNT)
            employee_id = random.randint(1, EMPLOYEES_COUNT)
            if (store_id, employee_id) not in unique_shifts:
                unique_shifts.add((store_id, employee_id))
                break

    print(f"Generated {len(unique_shifts)} unique shifts. Writing...")

    with open("store_shifts.csv", "w", newline="") as f:
        writer = csv.writer(f)

        current = 0
        for store_id, employee_id in unique_shifts:
            start_date = fake.date_between(start_date="-5y", end_date="today")
            end_date = fake.date_between(start_date=start_date, end_date="today")
            writer.writerow([store_id, employee_id, start_date, end_date])

            current += 1
            if current % 1000000 == 0:
                print(f"Processed {current} shifts")

    print("End create_store_shifts_csv")


if __name__ == "__main__":
    processes = []
    for func in [
        create_employee_roles_csv,
        create_employees_csv,
        create_stores_csv,
        create_store_shifts_csv,
    ]:
        p = Process(target=func)
        processes.append(p)
        p.start()

    for p in processes:
        p.join()

    print("\nFinished generating data")
