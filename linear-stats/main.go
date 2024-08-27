package main

import (
	"fmt"
	"linear-stats/linear"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	var data []float64

	// Read data from the file
	input, err := os.ReadFile("data.txt")
	if err != nil {
		log.Fatalf("Error reading file: %v", err)
	}

	if len(input) == 0 {
		log.Fatalln("Data.txt is empty")
	}

	// Parse the data
	nums := strings.Split(string(input), "\n")
	for _, val := range nums {
		if val == "" {
			continue
		}
		n, err := strconv.ParseFloat(val, 64)
		if err != nil {
			log.Fatalln("Invalid input data")
		}
		data = append(data, n)
	}

	// Calculate the Linear Regression Line and Pearson Correlation Coefficient
	m, b, r := linear.CalculateRegressionAndPearson(data)

	// Print the results
	fmt.Printf("Linear Regression Line: y = %.6fx + %.6f\n", m, b)
	fmt.Printf("Pearson Correlation Coefficient: %.10f\n", r)
}
