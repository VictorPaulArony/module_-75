package linear

import (
	"math"
	"testing"
)

// Helper function to compare floating-point numbers with a tolerance
func almostEqual(a, b, tolerance float64) bool {
	return math.Abs(a-b) <= tolerance
}

func TestCalculateRegressionAndPearson(t *testing.T) {
	tolerance := 0.000001

	tests := []struct {
		data      []float64
		expectedM float64
		expectedB float64
		expectedR float64
	}{
		{
			data:      []float64{10, 20, 30, 40, 50},
			expectedM: 10.0,
			expectedB: 10.0,
			expectedR: 1.0,
		},
		{
			data:      []float64{189, 113, 121, 114, 145, 110},
			expectedM: -8.742857,
			expectedB: 153.857143,
			expectedR: -0.5330331012,
		},
		{
			data:      []float64{5, 5, 5, 5, 5},
			expectedM: 0.0,
			expectedB: 5.0,
			expectedR: math.NaN(),
		},
		{
			data:      []float64{1, 2, 3, 4, 5},
			expectedM: 1.0,
			expectedB: 1.0,
			expectedR: 1.0,
		},
	}

	for _, test := range tests {
		m, b, r := CalculateRegressionAndPearson(test.data)

		if !almostEqual(m, test.expectedM, tolerance) {
			t.Errorf("Expected slope (m) to be %.6f, but got %.6f", test.expectedM, m)
		}
		if !almostEqual(b, test.expectedB, tolerance) {
			t.Errorf("Expected intercept (b) to be %.6f, but got %.6f", test.expectedB, b)
		}
		if math.IsNaN(test.expectedR) {
			if !math.IsNaN(r) {
				t.Errorf("Expected Pearson Correlation Coefficient (r) to be NaN, but got %.6f", r)
			}
		} else if !almostEqual(r, test.expectedR, tolerance) {
			t.Errorf("Expected Pearson Correlation Coefficient (r) to be %.10f, but got %.10f", test.expectedR, r)
		}
	}
}
