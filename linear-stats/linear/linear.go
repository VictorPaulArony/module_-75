package linear

import "math"

func CalculateRegressionAndPearson(data []float64) (float64, float64, float64) {
	n := float64(len(data))
	var sumX, sumY, sumXY, sumX2, sumY2 float64

	for i, y := range data {
		x := float64(i)
		sumX += x
		sumY += y
		sumXY += x * y
		sumX2 += x * x
		sumY2 += y * y
	}

	// Calculate the slope (m) and intercept (b) for the linear regression line
	m := (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
	b := (sumY - m*sumX) / n

	// Calculate the Pearson Correlation Coefficient (r)
	rNumerator := (n*sumXY - sumX*sumY)
	rDenominator := math.Sqrt((n*sumX2 - sumX*sumX) * (n*sumY2 - sumY*sumY))
	r := rNumerator / rDenominator

	return m, b, r
}
