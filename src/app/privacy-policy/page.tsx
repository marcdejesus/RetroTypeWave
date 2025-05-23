
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8" /> Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            Effective Date: May 23, 2024
          </p>
          <p>
            Welcome to Retro Type Wave ("us", "we", or "our"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>

          <h3 className="text-xl font-semibold text-accent pt-2">1. Information We Collect</h3>
          <p>
            We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li><strong>Cookies and Usage Data:</strong> We use cookies to store your preferences, such as your Elo rating, highest WPM, and chosen username, locally in your browser. This information is not typically transmitted to our servers unless you choose to submit your score to the global leaderboard.</li>
            <li><strong>Leaderboard Information:</strong> If you choose to submit your score to the global leaderboard, we will collect the username you provide, your Elo rating, and your highest WPM. This information will be stored in our Firebase Firestore database and publicly displayed on the leaderboard.</li>
          </ul>

          <h3 className="text-xl font-semibold text-accent pt-2">2. How We Use Your Information</h3>
          <p>
            We use personal information collected via our Services for a variety of business purposes described below:
          </p>
          <ul className="list-disc list-inside pl-4">
            <li>To facilitate account creation and logon process (deprecated - previously with Google Sign-in).</li>
            <li>To save your game progress and preferences locally using cookies.</li>
            <li>To post your scores to a public leaderboard if you choose to submit them.</li>
            <li>To manage user accounts for leaderboard display.</li>
          </ul>

          <h3 className="text-xl font-semibold text-accent pt-2">3. Will Your Information Be Shared With Anyone?</h3>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
          <p>
            Specifically, if you submit your score to the leaderboard, your chosen username, Elo, and WPM will be publicly visible.
          </p>

          <h3 className="text-xl font-semibold text-accent pt-2">4. How Long Do We Keep Your Information?</h3>
          <p>
            Locally stored cookie data (Elo, WPM, username) persists in your browser until you clear your cookies or the cookies expire (typically set for 365 days). Leaderboard entries are stored indefinitely in our Firestore database unless removed by administrative action.
          </p>

          <h3 className="text-xl font-semibold text-accent pt-2">5. How Do We Keep Your Information Safe?</h3>
          <p>
            We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>
          <p>
            Leaderboard data is stored in Firebase Firestore, which has its own robust security measures.
          </p>

          <h3 className="text-xl font-semibold text-accent pt-2">6. What Are Your Privacy Rights?</h3>
          <p>
            You can manage your cookie preferences through your browser settings. If you have submitted a score to the leaderboard and wish to have it removed, please contact us.
          </p>
          
          <h3 className="text-xl font-semibold text-accent pt-2">7. Updates To This Notice</h3>
          <p>
             We may update this privacy notice from time to time. The updated version will be indicated by an updated "Effective Date" and the updated version will be effective as soon as it is accessible.
          </p>

          <h3 className="text-xl font-semibold text-accent pt-2">8. How Can You Contact Us About This Notice?</h3>
          <p>
            If you have questions or comments about this notice, you may contact Marc De Jesus via his website: <a href="https://marcdejesusdev.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">marcdejesusdev.com</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
