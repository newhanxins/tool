https://www.doc88.com/p-7814379623022.html?r=1
https://www.keysight.com/us/en/assets/9018-04965/programming-guides/9018-04965.pdf?success=true
*RES\n
关闭mod
:OUTP:MOD OFF\n
关闭发射
:OUTP OFF\n
中心频率
:FREQ:FIX 100MHz\n
功率强度
:POW 10DBm\n
调整模式先打开
:RAD:CUST ON\n
调制MSK
:RAD:CUST:MOD:MSK\n
:RAD:CUST:MOD:MSK 40\n
调制 BPSK
:RAD:CUST:MOD BPSK\n
调制FSK
:RAD:CUST:MOD FSK\n
:RAD:CUST:MOD FSK4\n
调制FSK
:RAD:CUST:MOD:FSK 50KHZ\n
调制ASK
:RAD:CUST:MOD:ASK\n
设置码速率     247
:RAD:CUST:BRAT 10MBPS\n
设置频偏   165
:FREQ:OFFS 10GHZ\n
设置频偏状态
:FREQ:OFFS:STAT ON\n

过滤器开关 44
:LBFilter ON|OFF|1|0

调制速率 FM 228
:FM2:INT:FREQ 40KHZ
调制速率 AM 216
:AM1:INT2:FREQ UP
调制深度 190
:AM:WID:SENS 20\n