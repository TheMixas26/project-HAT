import random
import builtins, threading, time, sys

names=[]

def main():

    j=input("Добро пожаловать в игру 'Шляпа'! Введите количество игроков (минимум 3): ")
    colvo=int(input("А сколько слов загадываете? (рекомендуется 10): "))

    for j in range(1, int(j)+1):

        print("Игрок {j}, введите 10 имён, которые вы хотите загадать! Каждое имя на новой строке:")
        for i in range(colvo):
            name = input(f"Имя {i+1}: ")
            names.append(name)
            # отчищаем экран после ввода каждого имени
            print("\033c", end="")

    # перемешка имён
    random.shuffle(names)

    print("FIRST ROUND!!!\n\nОбясняйте другому игроку загаданное имя, 1 раунд - обэясняем только словами, никаких однокоренных, жестов и т.д. У вас есть 30 секунд\n\n")

    input("Нажмите Enter, когда будете готовы начать первый раунд...")
    print("\033c", end="")
    # здесь будет логика первого раунда

    for i in range(len(names)):
        print(f"Обяъсните имя {names[i]}")
        # логика отсчёта времени
        _old_input = builtins.input

        def _timed_input(prompt="", timeout=30):
            stop_evt = threading.Event()

            def _countdown():
                start = time.time()
                while not stop_evt.is_set():
                    left = int(timeout - (time.time() - start))
                    if left < 0:
                        sys.stdout.write("\rВремя вышло!                      \n")
                        sys.stdout.flush()
                        return
                    sys.stdout.write(f"\rОсталось: {left:2d} с.  ")
                    sys.stdout.flush()
                    time.sleep(0.2)

            t = threading.Thread(target=_countdown, daemon=True)
            t.start()
            try:
                result = _old_input(prompt)
            except EOFError:
                result = ""
            stop_evt.set()
            # небольшая пауза, чтобы поток успел завершиться и не пересечься с последующим выводом
            t.join(0.1)
            print()  # перенос строки после таймера/ввода
            return result

        # Заменяем встроенный input временно — следующий вызов input будет идти через _timed_input
        builtins.input = _timed_input
        check = input("Введите y, если имя отгадано и n, если вы хотите пропустить.")
        if check.lower() == 'y':
            print("Имя отгадано!")
        else:
            print("Имя пропущено.")
        print("\033c", end="")

    random.shuffle(names)

    print("SECOND ROUND!!!\n\nОбясняйте другому игроку загаданное имя, 2 раунд - объясняем только жестами. У вас есть 30 секунд\n\n")

    input("Нажмите Enter, когда будете готовы начать второй раунд...")
    print("\033c", end="")


    for i in range(len(names)):
        print(f"Обяъсните имя {names[i]}")
        _old_input = builtins.input

        def _timed_input(prompt="", timeout=30):
            stop_evt = threading.Event()

            def _countdown():
                start = time.time()
                while not stop_evt.is_set():
                    left = int(timeout - (time.time() - start))
                    if left < 0:
                        sys.stdout.write("\rВремя вышло!                      \n")
                        sys.stdout.flush()
                        return
                    sys.stdout.write(f"\rОсталось: {left:2d} с.  ")
                    sys.stdout.flush()
                    time.sleep(0.2)

            t = threading.Thread(target=_countdown, daemon=True)
            t.start()
            try:
                result = _old_input(prompt)
            except EOFError:
                result = ""
            stop_evt.set()
            # небольшая пауза, чтобы поток успел завершиться и не пересечься с последующим выводом
            t.join(0.1)
            print()  # перенос строки после таймера/ввода
            return result

        # Заменяем встроенный input временно — следующий вызов input будет идти через _timed_input
        builtins.input = _timed_input
        check = input("Введите y, если имя отгадано и n, если вы хотите пропустить.")
        if check.lower() == 'y':
            print("Имя отгадано!")
        else:
            print("Имя пропущено.")
        print("\033c", end="")


    random.shuffle(names)

    print("THIRD ROUND!!!\n\nОбясняйте другому игроку загаданное имя, 3 раунд - объясняем одним словом. У вас есть 30 секунд\n\n")

    input("Нажмите Enter, когда будете готовы начать третий раунд...")
    print("\033c", end="")

    for i in range(len(names)):
        print(f"Обяъсните имя {names[i]}")
        # логика отсчёта времени
        _old_input = builtins.input

        def _timed_input(prompt="", timeout=30):
            stop_evt = threading.Event()

            def _countdown():
                start = time.time()
                while not stop_evt.is_set():
                    left = int(timeout - (time.time() - start))
                    if left < 0:
                        sys.stdout.write("\rВремя вышло!                      \n")
                        sys.stdout.flush()
                        return
                    sys.stdout.write(f"\rОсталось: {left:2d} с.  ")
                    sys.stdout.flush()
                    time.sleep(0.2)

            t = threading.Thread(target=_countdown, daemon=True)
            t.start()
            try:
                result = _old_input(prompt)
            except EOFError:
                result = ""
            stop_evt.set()
            # небольшая пауза, чтобы поток успел завершиться и не пересечься с последующим выводом
            t.join(0.1)
            print()  # перенос строки после таймера/ввода
            return result

        # Заменяем встроенный input временно — следующий вызов input будет идти через _timed_input
        builtins.input = _timed_input
        check = input("Введите y, если имя отгадано и n, если вы хотите пропустить.")
        if check.lower() == 'y':
            print("Имя отгадано!")
        else:
            print("Имя пропущено.")
        print("\033c", end="")



if __name__ == "__main__":
    main()