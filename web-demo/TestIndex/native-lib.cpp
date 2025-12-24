#include <iostream>
#include <thread>     // 添加这个头文件来使用 std::this_thread
#include <chrono>     // 添加这个头文件来使用 std::chrono

#define EXPORT __declspec(dllexport)

// 回调函数类型：接收一个长度为 2000 的数组
typedef void (*Callback)(int* data, int size);

// 导出的函数：每秒调用 20 次，每次回调一个数组（大小为 2000）
extern "C" {
    EXPORT void startCallbackLoop(Callback callback) {
        const int arraySize = 2000;
        int data[arraySize];  // 创建一个大小为 2000 的数组

        for (int i = 0; i < arraySize; ++i) {
            data[i] = i;  // 填充数据（这里我们用 i 填充，可以根据需要填充其他数据）
        }

        // 每秒调用 20 次
        for (int i = 0; i < 20; ++i) {
            callback(data, arraySize);  // 将数组传递给回调函数
            std::this_thread::sleep_for(std::chrono::milliseconds(50));  // 每 50 毫秒调用一次
        }
    }
}

//g++ -shared -o native-lib.dll native-lib.cpp
