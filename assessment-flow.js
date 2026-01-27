/* ==================== ASSESSMENT FLOW - RESULT POPUP + EMAIL MODAL ==================== */
/* Version: 1.0 - Based on COMPLETE_DESIGN_SPEC_v4.md */

const AssessmentFlow = (() => {
  let resultQuadrant = null;

  const quadrantData = {
    q1: {
      name: "Prompt Whisperers",
      percentage: "28%",
      description: "Strategic AI users who pick high-value use cases and deploy thoughtfully."
    },
    q2: {
      name: "Zen PMO",
      percentage: "6%",
      description: "AI is deeply embedded across the entire PMO - it's the operating system."
    },
    q3: {
      name: "Spreadsheet Nation",
      percentage: "10%",
      description: "Still relying on traditional tools and processes without systematic AI use."
    },
    q4: {
      name: "ChatGPT Fan Club",
      percentage: "52%",
      description: "High AI usage but scattered pilots without clear value or strategic direction."
    }
  };

  return {
    showResultPopup: function(quadrant) {
      resultQuadrant = quadrant;
      const data = quadrantData[quadrant];

      // Update popup content
      const popup = document.getElementById('heroResultPopup');
      popup.className = 'hero-result-popup hero-active hero-' + quadrant;

      document.getElementById('resultTitle').textContent = data.name;
      document.getElementById('resultSubtitle').textContent = "You're in the " + data.percentage;
      document.getElementById('resultDesc').textContent = data.description;

      // Show backdrop + popup
      document.getElementById('heroResultBackdrop').classList.add('hero-active');
    },

    closeResultPopup: function() {
      document.getElementById('heroResultPopup').classList.remove('hero-active');
      document.getElementById('heroResultBackdrop').classList.remove('hero-active');
    },

    showEmailModal: function() {
      this.closeResultPopup();
      document.getElementById('heroEmailModal').classList.add('hero-active');
    },

    closeEmailModal: function() {
      document.getElementById('heroEmailModal').classList.remove('hero-active');
      document.getElementById('heroErrorMsg').classList.remove('hero-active');
    },

    submitEmail: function() {
      const email = document.getElementById('heroEmailInput').value;
      const wantsAssessment = document.getElementById('heroCheckAssessment').checked;
      const wantsNewsletter = document.getElementById('heroCheckNewsletter').checked;
      const errorMsg = document.getElementById('heroErrorMsg');

      // Validate email
      if (!email || !email.includes('@')) {
        errorMsg.textContent = 'Please enter a valid email address';
        errorMsg.classList.add('hero-active');
        return;
      }

      // Must select at least one option
      if (!wantsAssessment && !wantsNewsletter) {
        errorMsg.textContent = 'Please select at least one option';
        errorMsg.classList.add('hero-active');
        return;
      }

      errorMsg.classList.remove('hero-active');

      // EmailOctopus integration here
      // TODO: Replace with actual EmailOctopus API call
      console.log('Email submission:', {
        email,
        wantsAssessment,
        wantsNewsletter,
        quadrant: resultQuadrant
      });

      // For demo: show success message
      alert('Success! Check your email for:\n' +
            (wantsAssessment ? '✓ Advanced assessment link\n' : '') +
            (wantsNewsletter ? '✓ Weekly newsletter subscription' : ''));

      this.closeEmailModal();
    }
  };
})();

// Close on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    AssessmentFlow.closeResultPopup();
    AssessmentFlow.closeEmailModal();
  }
});
