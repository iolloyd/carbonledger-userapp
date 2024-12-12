<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div class="space-y-8">
        <!-- Introduction -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p class="text-gray-600">
            This Privacy Policy explains how we collect, use, store, and share your personal information when you use our services. 
            By using our application, you agree to the terms set out here.
          </p>
        </section>

        <!-- Data We Collect -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">2. Data We Collect</h2>
          <p class="text-gray-600 mb-3">We may collect:</p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>Personal details you provide, like name and email.</li>
            <li>Usage data, such as login times and features used.</li>
            <li>Technical data, including IP address and device type.</li>
          </ul>
          <p class="text-gray-600 mt-3">We do not collect sensitive personal data unless required by law.</p>
        </section>

        <!-- How We Use Your Data -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Data</h2>
          <p class="text-gray-600 mb-3">We use your data to:</p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>Provide and improve our service.</li>
            <li>Respond to customer support requests.</li>
            <li>Analyze trends and enhance user experience.</li>
            <li>Communicate updates and offers (you can opt out at any time).</li>
          </ul>
        </section>

        <!-- Sharing Your Data -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">4. Sharing Your Data</h2>
          <p class="text-gray-600 mb-3">
            We do not sell your personal data. We share information only when needed, such as:
          </p>
          <ul class="list-disc list-inside text-gray-600 space-y-2">
            <li>With third-party service providers who help us run the application.</li>
            <li>When required by law, for example responding to a legal request.</li>
          </ul>
        </section>

        <!-- Cookies and Tracking -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking</h2>
          <p class="text-gray-600">
            We use cookies and similar tools to personalize your experience. You can choose to disable cookies in your browser settings, 
            but some features may not work as intended.
          </p>
        </section>

        <!-- Data Security -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
          <p class="text-gray-600">
            We apply industry-standard security measures to protect your data. However, no online service is completely secure, 
            and we cannot guarantee absolute protection.
          </p>
        </section>

        <!-- Your Rights -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
          <p class="text-gray-600">
            You have rights over your data, including the right to access, update, or delete it. 
            To exercise these rights, please contact us.
          </p>
        </section>

        <!-- Third-Party Links -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Links</h2>
          <p class="text-gray-600">
            Our service may link to other sites. We are not responsible for their practices, 
            so review their privacy policies before sharing your data.
          </p>
        </section>

        <!-- Updates to This Policy -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">9. Updates to This Policy</h2>
          <p class="text-gray-600">
            We may update this policy as our service evolves. Changes take effect when posted, 
            and we will notify you of any significant updates.
          </p>
        </section>

        <!-- Contact Us -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
          <p class="text-gray-600">
            If you have questions, please contact our support team at 
            <a href="mailto:lloyd@carbonledger.tech" class="text-green-600 hover:text-green-500">
              lloyd@carbonledger.tech
            </a>.
          </p>
        </section>

        <!-- Acknowledgment -->
        <section class="border-t pt-8 mt-8">
          <p class="text-gray-600 italic">
            By using our service, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <p class="text-gray-500 text-sm mt-4">
            Last updated: {{ new Date().toLocaleDateString() }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script> 