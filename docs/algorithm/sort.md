# 经典排序算法

## 冒泡排序

每一轮只把一个元素冒泡到数列的一端，依次循环遍历，直到所有元素循环一遍。

* 平均时间复杂度：O(n^2)
* 最好情况：O(n)
* 最坏情况：O(n^2)

```js
/**
 * 冒泡排序
 * @param { Array } arr 
 */
function bubbleSort(arr) {
	const length = arr.length;

	for (let i=0; i<length-1; i++) {
		for (let j=0; j<length-i-1; j++) {
			if (arr[j] > arr[j+1]) { // 元素两两比较大的值放在右边
				const temp = arr[j];
				arr[j] = arr[j + 1];
				arr[j + 1] = temp;
			}
		}
	}

	return arr;
}

const arr = [2, 5, 1, 7, 4, 9, 6];
console.log(bubbleSort(arr)); // [ 1, 2, 4, 5, 6, 7, 9]
```

## 选择排序

核心算法是在未排序数据中找到最小/大值，存放到排序序列开始位置

```js
/**
 * 选择排序 O(n^2)
 * 核心算法是在未排序数据中找到最小/大值，存放到排序序列开始位置
 * @param { Array } arr 
 * @returns { Array } 
 */
function selectSort(arr) {
	const length = arr.length;
	let minIndex;

	for (let i=0; i<length; i++) {
			minIndex = i;
			for (let j=i+1; j<length; j++) {
				if (arr[j] < arr[minIndex]) {
					minIndex = j;
				}
			}

			swap(arr, i, minIndex)
	}

	return arr;
}
```

## 插入排序

核心实现：提前终止内层循环，使用赋值，避免 swap 交换，当元素是有序时，插入算法将会是一个 O(n) 级别的
* 将一个元素当作有序序列，之后从二个元素到最后一个元素当作未排序序列，依次循环未排序序列 (最外层 i 循环，行 {1})
* 每一层循环（最外层）比如 i = 2，2 之前的称为内存循环（行 {2}）
* 内层循环元素如果比当前的元素 e 大，元素后移
* 内层循环元素如果比当前的元素 e 小，直接 Break 跳出循环，将 e 插入适当位置

```js
/**
 * 插入排序 O(n^2)
 * 核心实现：提前终止内层循环，使用赋值，避免 swap 交换，当元素是有序时，插入算法将会是一个 O(n) 级别的
 * 内层循环元素如果比当前的元素 e 大，元素后移
 * 内层循环元素如果比当前的元素 e 小，直接 Break 跳出循环，将 e 插入适当位置
 * @param { Array } arr 
 * @returns { Array }
 */
function insertSort(arr) {
	const length = arr.length;

	for (let i=1; i<length; i++) { // {1}
		let j;
		let e=arr[i];

		// for (j=i; j>0; j--) { // {2}
		// 	if (arr[j-1] > e) {
		// 		arr[j] = arr[j-1];
		// 	} else {
		// 		break;
		// 	}
		// }

		// 上面注释部份的一种精简写法
		for (j=i; j>0 && arr[j-1] > e; j--) { // {2}
			arr[j] = arr[j-1];
		}

		arr[j] = e;
	}

	return arr;
}
```

## 快速排序

基于冒泡排序，不同的是冒泡排序每一轮只把一个元素冒泡的数据的另一端，在**快速排序中每轮选中设置一个基准值，小于基准值的放到左边，大于基准值的放到右边**，之后在基准值的左边、右边再次递归操作，这种方法称为**分治法**。

重点在于基准值的设置和排序实现，定义分区方法 partition 使用指针交换算法实现，具体做以下几步：

* 设置开始、结束两个指针
* 如果指针重合结束，否则以下三步继续轮询
	1. 右边指针大于基准值位置左移，否则停止
	2. 左边指针小于基准值位置右移，否则停止
	3. 左右指针位置元素交换，继续轮询直到指针重合
* 指针重合位置元素与最开始设置的基准值交换位置，当前分区排序完成，返回当前基准值的位置


```js
/**
 * 快速排序 
 * @param { Array } arr 
 */
function quickSort(arr) {
	return _quickSort(arr, 0, arr.length - 1);
}

/**
 * 快速排序递归调用函数
 * @param { Array } arr 
 * @param { Number } left 
 * @param { Number } right 
 */
function _quickSort(arr, left, right) {
	if (left > right) return;

	const p = partition(arr, left, right); // 分区，最后返回基准值
	_quickSort(arr, left, p - 1); // 基准值左侧递归
	_quickSort(arr, p + 1, right) // 基准值右侧递归
}

/**
 * 分区，通过指针交换法算法实现
 * 设置开始、结束两个指针
 * 如果指针重合结束，否则以下三步继续轮询：
 * 1. 右边指针大于基准值位置左移，否则停止
 * 2. 左边指针小于基准值位置右移，否则停止
 * 3. 左右指针位置元素交换，继续轮询直到指针重合
 * 指针重合位置元素与最开始设置的基准值交换位置，当前分区排序完成，返回当前基准值的位置
 * @param { Array } arr 
 * @param { Number } left 
 * @param { Number } right 
 */
function partition(arr, left, right) {
	const pivot = arr[left]; // 基准值
	let startIndex = left;
	let endIndex = right;

	while (startIndex !== endIndex) {
		while (startIndex < endIndex && arr[endIndex] > pivot) {
			endIndex--;
		}

		while (startIndex < endIndex && arr[startIndex] <= pivot) {
			startIndex++;
		}

		if (startIndex < endIndex) {
			swap(arr, startIndex, endIndex);
		}
	}

	// 指针重合位置元素与最开始设置的基准值交换位置，当前分区排序完成左侧小于基准值，右侧大于基准值
	swap(arr, startIndex, left);

	return startIndex; // 返回基准值所处位置
}

function swap(arr, a, b) {
	const temp = arr[a];
	arr[a] = arr[b];
	arr[b] = temp;
}

let arr = [18, 9, 3, 2, 1, 0];
arr = [4, 7, 6, 5, 3, 2, 8, 1]
quickSort(arr);
console.log(arr);
```

参考 [漫画：什么是快速排序？（完整版）](https://mp.weixin.qq.com/s/PQLC7qFjb74kt6PdExP8mw)

## 归并排序

归并排序是分而治之算法的经典应用，将数据一分为二，进行归并操作，时间复杂度为 O(nlogn)。

```js
/**
 * 归并排序，自上而下方式
 * @param { Array } arr 
 */
function mergeSort(arr) {
  const len = arr.length;

  if (len <=1 ) return arr;

  const mid = Math.floor(len/2);
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid);

  return merge(mergeSort(leftArr), mergeSort(rightArr));
}

function merge(leftArr, rightArr) {
  const res = [];

  while(leftArr.length && rightArr.length) {
    leftArr[0] < rightArr[0] ? res.push(leftArr.shift()) : res.push(rightArr.shift());
  }

  while(leftArr.length) {
    res.push(leftArr.shift());
  }

  while(rightArr.length) {
    res.push(rightArr.shift());
  }

  return res;
}
const arr = [11,5,2,7,4,9,10];
console.log(mergeSort(arr))

const a=[2,5,11], b=[4,7,9,10];
console.log(merge(mergeSort(a), mergeSort(b)));
```

## 参考

* [github.com/hustcc/JS-Sorting-Algorithm](https://github.com/hustcc/JS-Sorting-Algorithm)