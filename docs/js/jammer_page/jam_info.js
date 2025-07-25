let INFINITE = 9999999;
let NUM_JAMMERS = 13205;
let JAM_INFO_LIST = [
	{
		is_majorjam: false,
		mj_id: 1,
	},
	{
		is_majorjam: false,
		mj_id: 2,
	},
	{
		is_majorjam: false,
		mj_id: 3,
	},
	{
		is_majorjam: false,
		mj_id: 4,
	},
	{
		is_majorjam: false,
		mj_id: 5,
	},
	{
		is_majorjam: false,
		mj_id: 6,
	},
	{
		is_majorjam: false,
		mj_id: 7,
	},
	{
		is_majorjam: false,
		mj_id: 8,
	},
	{
		is_majorjam: false,
		mj_id: 9,
	},
	{
		is_majorjam: false,
		mj_id: 10,
	},
	{
		is_majorjam: false,
		mj_id: 11,
	},
	{
		is_majorjam: false,
		mj_id: 12,
	},
	{
		is_majorjam: false,
		mj_id: 13,
	},
	{
		is_majorjam: false,
		mj_id: 14,
	},
	{
		is_majorjam: false,
		mj_id: 15,
	},
	{
		is_majorjam: false,
		mj_id: 16,
	},
	{
		is_majorjam: false,
		mj_id: 17,
	},
	{
		is_majorjam: false,
		mj_id: 18,
	},
	{
		is_majorjam: false,
		mj_id: 19,
	},
	{
		is_majorjam: false,
		mj_id: 20,
	},
	{
		is_majorjam: false,
		mj_id: 21,
	},
	{
		is_majorjam: false,
		mj_id: 22,
	},
	{
		is_majorjam: false,
		mj_id: 23,
	},
	{
		is_majorjam: false,
		mj_id: 24,
	},
	{
		is_majorjam: false,
		mj_id: 25,
	},
	{
		is_majorjam: false,
		mj_id: 26,
	},
	{
		is_majorjam: false,
		mj_id: 27,
	},
	{
		is_majorjam: false,
		mj_id: 28,
	},
	{
		is_majorjam: false,
		mj_id: 29,
	},
	{
		is_majorjam: false,
		mj_id: 30,
	},
	{
		is_majorjam: false,
		mj_id: 31,
	},
	{
		is_majorjam: false,
		mj_id: 32,
	},
	{
		is_majorjam: false,
		mj_id: 33,
	},
	{
		is_majorjam: false,
		mj_id: 34,
	},
	{
		is_majorjam: false,
		mj_id: 35,
	},
	{
		is_majorjam: false,
		mj_id: 36,
	},
	{
		is_majorjam: false,
		mj_id: 37,
	},
	{
		is_majorjam: false,
		mj_id: 38,
	},
	{
		is_majorjam: false,
		mj_id: 39,
	},
	{
		is_majorjam: false,
		mj_id: 40,
	},
	{
		is_majorjam: false,
		mj_id: 41,
	},
	{
		is_majorjam: false,
		mj_id: 42,
	},
	{
		is_majorjam: false,
		mj_id: 43,
	},
	{
		is_majorjam: false,
		mj_id: 44,
	},
	{
		is_majorjam: false,
		mj_id: 45,
	},
	{
		is_majorjam: false,
		mj_id: 46,
	},
	{
		is_majorjam: false,
		mj_id: 47,
	},
	{
		is_majorjam: false,
		mj_id: 48,
	},
	{
		is_majorjam: false,
		mj_id: 49,
	},
	{
		is_majorjam: false,
		mj_id: 50,
	},
	{
		is_majorjam: true,
		mj_id: 1,
	},
	{
		is_majorjam: false,
		mj_id: 51,
	},
	{
		is_majorjam: false,
		mj_id: 52,
	},
	{
		is_majorjam: false,
		mj_id: 53,
	},
	{
		is_majorjam: false,
		mj_id: 54,
	},
	{
		is_majorjam: false,
		mj_id: 55,
	},
	{
		is_majorjam: false,
		mj_id: 56,
	},
	{
		is_majorjam: false,
		mj_id: 57,
	},
	{
		is_majorjam: true,
		mj_id: 2,
	},
	{
		is_majorjam: false,
		mj_id: 58,
	},
	{
		is_majorjam: false,
		mj_id: 59,
	},
	{
		is_majorjam: false,
		mj_id: 60,
	},
	{
		is_majorjam: false,
		mj_id: 61,
	},
	{
		is_majorjam: false,
		mj_id: 62,
	},
	{
		is_majorjam: false,
		mj_id: 63,
	},
	{
		is_majorjam: false,
		mj_id: 64,
	},
	{
		is_majorjam: false,
		mj_id: 65,
	},
	{
		is_majorjam: false,
		mj_id: 66,
	},
	{
		is_majorjam: false,
		mj_id: 67,
	},
	{
		is_majorjam: false,
		mj_id: 68,
	},
	{
		is_majorjam: true,
		mj_id: 3,
	},
	{
		is_majorjam: false,
		mj_id: 69,
	},
	{
		is_majorjam: false,
		mj_id: 70,
	},
	{
		is_majorjam: false,
		mj_id: 71,
	},
	{
		is_majorjam: false,
		mj_id: 72,
	},
	{
		is_majorjam: false,
		mj_id: 73,
	},
	{
		is_majorjam: false,
		mj_id: 74,
	},
	{
		is_majorjam: false,
		mj_id: 75,
	},
	{
		is_majorjam: false,
		mj_id: 76,
	},
	{
		is_majorjam: false,
		mj_id: 77,
	},
	{
		is_majorjam: false,
		mj_id: 78,
	},
	{
		is_majorjam: false,
		mj_id: 79,
	},
	{
		is_majorjam: false,
		mj_id: 80,
	},
	{
		is_majorjam: false,
		mj_id: 81,
	},
	{
		is_majorjam: false,
		mj_id: 82,
	},
	{
		is_majorjam: false,
		mj_id: 83,
	},
	{
		is_majorjam: false,
		mj_id: 84,
	},
	{
		is_majorjam: false,
		mj_id: 85,
	},
	{
		is_majorjam: false,
		mj_id: 86,
	},
	{
		is_majorjam: true,
		mj_id: 4,
	},
	{
		is_majorjam: false,
		mj_id: 87,
	},
	{
		is_majorjam: false,
		mj_id: 88,
	},
	{
		is_majorjam: false,
		mj_id: 89,
	},
	{
		is_majorjam: false,
		mj_id: 90,
	},
	{
		is_majorjam: false,
		mj_id: 91,
	},
	{
		is_majorjam: false,
		mj_id: 92,
	},
	{
		is_majorjam: false,
		mj_id: 93,
	},
	{
		is_majorjam: false,
		mj_id: 94,
	},
	{
		is_majorjam: false,
		mj_id: 95,
	},
	{
		is_majorjam: false,
		mj_id: 96,
	},
	{
		is_majorjam: false,
		mj_id: 97,
	},
	{
		is_majorjam: false,
		mj_id: 98,
	},
	{
		is_majorjam: false,
		mj_id: 99,
	},
	{
		is_majorjam: false,
		mj_id: 100,
	},
	{
		is_majorjam: false,
		mj_id: 101,
	},
	{
		is_majorjam: false,
		mj_id: 102,
	},
	{
		is_majorjam: false,
		mj_id: 103,
	},
	{
		is_majorjam: false,
		mj_id: 104,
	},
	{
		is_majorjam: false,
		mj_id: 105,
	},
	{
		is_majorjam: false,
		mj_id: 106,
	},
	{
		is_majorjam: false,
		mj_id: 107,
	},
	{
		is_majorjam: false,
		mj_id: 108,
	},
	{
		is_majorjam: false,
		mj_id: 109,
	},
	{
		is_majorjam: false,
		mj_id: 110,
	},
	{
		is_majorjam: false,
		mj_id: 111,
	},
	{
		is_majorjam: false,
		mj_id: 112,
	},
	{
		is_majorjam: false,
		mj_id: 113,
	},
	{
		is_majorjam: true,
		mj_id: 5,
	},
	{
		is_majorjam: false,
		mj_id: 114,
	},
	{
		is_majorjam: false,
		mj_id: 115,
	},
	{
		is_majorjam: false,
		mj_id: 116,
	},
	{
		is_majorjam: false,
		mj_id: 117,
	},
	{
		is_majorjam: false,
		mj_id: 118,
	},
	{
		is_majorjam: false,
		mj_id: 119,
	},
	{
		is_majorjam: false,
		mj_id: 120,
	},
	{
		is_majorjam: false,
		mj_id: 121,
	},
	{
		is_majorjam: false,
		mj_id: 122,
	},
	{
		is_majorjam: false,
		mj_id: 123,
	},
	{
		is_majorjam: false,
		mj_id: 124,
	},
	{
		is_majorjam: false,
		mj_id: 125,
	},
	{
		is_majorjam: false,
		mj_id: 126,
	},
	{
		is_majorjam: false,
		mj_id: 127,
	},
	{
		is_majorjam: false,
		mj_id: 128,
	},
	{
		is_majorjam: false,
		mj_id: 129,
	},
	{
		is_majorjam: false,
		mj_id: 130,
	},
	{
		is_majorjam: false,
		mj_id: 131,
	},
	{
		is_majorjam: false,
		mj_id: 132,
	},
	{
		is_majorjam: false,
		mj_id: 133,
	},
	{
		is_majorjam: false,
		mj_id: 134,
	},
	{
		is_majorjam: false,
		mj_id: 135,
	},
	{
		is_majorjam: false,
		mj_id: 136,
	},
	{
		is_majorjam: false,
		mj_id: 137,
	},
	{
		is_majorjam: true,
		mj_id: 6,
	},
	{
		is_majorjam: false,
		mj_id: 138,
	},
	{
		is_majorjam: false,
		mj_id: 139,
	},
	{
		is_majorjam: false,
		mj_id: 140,
	},
	{
		is_majorjam: false,
		mj_id: 141,
	},
	{
		is_majorjam: false,
		mj_id: 142,
	},
	{
		is_majorjam: false,
		mj_id: 143,
	},
	{
		is_majorjam: false,
		mj_id: 144,
	},
	{
		is_majorjam: false,
		mj_id: 145,
	},
	{
		is_majorjam: false,
		mj_id: 146,
	},
	{
		is_majorjam: false,
		mj_id: 147,
	},
	{
		is_majorjam: false,
		mj_id: 148,
	},
	{
		is_majorjam: false,
		mj_id: 149,
	},
	{
		is_majorjam: false,
		mj_id: 150,
	},
	{
		is_majorjam: false,
		mj_id: 151,
	},
	{
		is_majorjam: false,
		mj_id: 152,
	},
	{
		is_majorjam: false,
		mj_id: 153,
	},
	{
		is_majorjam: false,
		mj_id: 154,
	},
	{
		is_majorjam: false,
		mj_id: 155,
	},
	{
		is_majorjam: false,
		mj_id: 156,
	},
	{
		is_majorjam: false,
		mj_id: 157,
	},
	{
		is_majorjam: false,
		mj_id: 158,
	},
	{
		is_majorjam: false,
		mj_id: 159,
	},
	{
		is_majorjam: false,
		mj_id: 160,
	},
	{
		is_majorjam: false,
		mj_id: 161,
	},
	{
		is_majorjam: false,
		mj_id: 162,
	},
	{
		is_majorjam: false,
		mj_id: 163,
	},
	{
		is_majorjam: false,
		mj_id: 164,
	},
	{
		is_majorjam: false,
		mj_id: 165,
	},
	{
		is_majorjam: false,
		mj_id: 166,
	},
	{
		is_majorjam: false,
		mj_id: 167,
	},
	{
		is_majorjam: false,
		mj_id: 168,
	},
	{
		is_majorjam: false,
		mj_id: 169,
	},
	{
		is_majorjam: false,
		mj_id: 170,
	},
	{
		is_majorjam: false,
		mj_id: 171,
	},
	{
		is_majorjam: false,
		mj_id: 172,
	},
	{
		is_majorjam: false,
		mj_id: 173,
	},
	{
		is_majorjam: false,
		mj_id: 174,
	},
	{
		is_majorjam: false,
		mj_id: 175,
	},
	{
		is_majorjam: false,
		mj_id: 176,
	},
	{
		is_majorjam: false,
		mj_id: 177,
	},
	{
		is_majorjam: false,
		mj_id: 178,
	},
	{
		is_majorjam: false,
		mj_id: 179,
	},
	{
		is_majorjam: false,
		mj_id: 180,
	},
	{
		is_majorjam: false,
		mj_id: 181,
	},
	{
		is_majorjam: false,
		mj_id: 182,
	},
	{
		is_majorjam: false,
		mj_id: 183,
	},
	{
		is_majorjam: false,
		mj_id: 184,
	},
	{
		is_majorjam: false,
		mj_id: 185,
	},
	{
		is_majorjam: true,
		mj_id: 7,
	},
	{
		is_majorjam: false,
		mj_id: 186,
	},
	{
		is_majorjam: false,
		mj_id: 187,
	},
	{
		is_majorjam: false,
		mj_id: 188,
	},
	{
		is_majorjam: false,
		mj_id: 189,
	},
];
