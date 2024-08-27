# Linear Regression and Pearson Correlation Coefficient Calculator
This Go program reads a series of y-values from a text file and calculates the Linear Regression Line and the Pearson Correlation Coefficient for the data. The x-values are assumed to be the line numbers (0, 1, 2, 3, ...).

## Prerequisites
Go installed on your machine.
## Usage
1. Prepare Your Data
Create a text file named data.txt in the same directory as your Go program. The file should contain a list of y-values, each on a new line. The x-values are implicitly the line numbers (starting from 0).
```
Example data.txt:

Copy code
189
113
121
114
145
110
```
2. **Run the Program**

You can run the program by navigating to the directory containing your Go file and the data.txt file, and then running the following command:


```sh
go run main.go data.txt
```

3. **Output**

The program will print the Linear Regression Line equation and the Pearson Correlation Coefficient.

#### Example output:

```sh
Linear Regression Line: y = 1.234567x + 8.901234
Pearson Correlation Coefficient: 0.9876543210
```
4. **Error Handling**

If the data.txt file is empty, the program will terminate with the message: `Data.txt is empty.`
If the data.txt file contains invalid data (non-numeric values), the program will terminate with the message: Invalid input data.

5. **Testing**

To test the program:

- Modify the data.txt file with different sets of numbers.
- Run the program to see how the Linear Regression Line and Pearson Correlation Coefficient change.

Ensure the input data is formatted correctly as shown in the example above. 
The x-values are generated based on the line numbers, so the program expects one y-value per line.

## Example Test Cases

### Case 1: Normal Data
`data.txt:`

```sh
10
20
30
40
50
```
Expected output:

```sh
Linear Regression Line: y = 10.000000x + 10.000000
Pearson Correlation Coefficient: 1.0000000000
```
### Case 2: Data with Variance
`data.txt:`

```sh
189
113
121
114
145
110
```
Expected output will vary based on actual calculations.

### Case 3: Empty Data File
If `data.txt` is empty, the output should be:

```sh
Data.txt is empty
```
## License
This project is licensed under the MIT License - see the LICENSE file for details.