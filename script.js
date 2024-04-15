document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("taxForm");
    const modal = document.getElementById("modal");
    const modalClose = document.querySelector(".close");
    // const taxResult = document.getElementById("taxResult");
    const taxableIncomeSpan = document.getElementById("taxableIncome");
    const taxPayableSpan = document.getElementById("taxPayable");

    const inputs = document.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                validateInput(this);
            }, 500);
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        hideErrorIcons();

        const age = document.getElementById("age").value;
        const income = parseFloat(document.getElementById("income").value);
        const extraIncome = parseFloat(document.getElementById("extraIncome").value);
        const deductions = parseFloat(document.getElementById("deductions").value);

        if (!validateInputs(age, income, extraIncome, deductions)) {
            return;
        }

        const taxableIncome = calculateTaxableIncome(income, extraIncome, deductions);
        const tax = calculateTax(age, taxableIncome);

        // taxResult.textContent = `Tax Payable : ${tax.toFixed(2)} Lakhs`;
        taxableIncomeSpan.textContent = taxableIncome;
        taxPayableSpan.textContent = tax;
        modal.style.display = "block";
    });

    modalClose.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    function validateInput(input) {
        const value = input.value.trim();
        const errorIcon = input.parentElement.querySelector('.error-icon');
        
        if (value === '' || isNaN(parseFloat(value)) || value.includes('-')) {
            errorIcon.style.display = "inline";
        } else {
            errorIcon.style.display = "none";
        }
    }

    function hideErrorIcons() {
        const errorIcons = document.querySelectorAll(".error-icon");
        errorIcons.forEach(icon => {
            icon.style.display = "none";
        });
    }

    function validateInputs(age, income, extraIncome, deductions) {
        let isValid = true;

        if (!age) {
            document.getElementById("ageErrorIcon").style.display = "inline";
            isValid = false;
        }

        if (isNaN(income) || income <= 0) {
            document.getElementById("incomeErrorIcon").style.display = "inline";
            isValid = false;
        }

        if (isNaN(extraIncome) || extraIncome < 0) {
            document.getElementById("extraIncomeErrorIcon").style.display = "inline";
            isValid = false;
        }

        if (isNaN(deductions) || deductions < 0) {
            document.getElementById("deductionsErrorIcon").style.display = "inline";
            isValid = false;
        }

        return isValid;
    }

    function calculateTaxableIncome(income, extraIncome, deductions) {
        return income + extraIncome - deductions;
    }

    function calculateTax(age, taxableIncome) {
        let tax = 0;

        if (taxableIncome > 800000) {
            switch (age) {
                case "<40":
                    tax = 0.3 * (taxableIncome - 800000);
                    break;
                case "40-60":
                    tax = 0.4 * (taxableIncome - 800000);
                    break;
                case "≥60":
                    tax = 0.1 * (taxableIncome - 800000);
                    break;
            }
        }

        return tax;
    }
});
