package main

import (
	"io"
	"os"
	"strings"
	"testing"
)

func TestMainProgram(t *testing.T) {
	// Prepare test data file
	testData := `189
113
121
114
145
110
`
	testFileName := "testdata.txt"
	err := os.WriteFile(testFileName, []byte(testData), 0o644)
	if err != nil {
		t.Fatalf("Failed to write test data to file: %v", err)
	}
	defer os.Remove(testFileName) // Clean up test data file

	// Redirect stdout to capture the output
	old := os.Stdout
	r, w, err := os.Pipe()
	if err != nil {
		t.Fatalf("Failed to create pipe: %v", err)
	}
	os.Stdout = w

	// Run the main program
	os.Args = []string{"cmd", testFileName} // Simulate command line arguments
	main()

	// Capture the output
	w.Close()
	out, err := io.ReadAll(r)
	if err != nil {
		t.Fatalf("Failed to read from pipe: %v", err)
	}
	os.Stdout = old

	// Define expected output without any leading spaces
	expectedOutput := "Linear Regression Line: y = 0.002601x + -2250.489026\nPearson Correlation Coefficient: 0.0058836259"

	// Trim any leading/trailing whitespace from actual output
	output := strings.TrimSpace(string(out))

	// Compare output
	if output != expectedOutput {
		t.Errorf("Expected:\n%q\nGot:\n%q", expectedOutput, output)
	}
}
