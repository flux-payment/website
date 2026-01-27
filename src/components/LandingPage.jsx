import React from 'react';
import HeroHeartbeat from './LoadingScreen';
import FlyingCards from './FlyingCards';

function LandingPage() {
    return (
        <div className="relative min-h-screen text-white font-sans selection:bg-flux-primary selection:text-white pb-32">

            {/* The Hero/Header Logic encapsulated here (Fixed Position) */}
            <HeroHeartbeat />

            <main className="relative z-10 bg-black">

                {/* Flying Cards Section - ensure it has black bg to cover anything behind if needed */}
                <div className="relative z-20 bg-black">
                    <FlyingCards />
                </div>

                {/* Coming Soon is now integrated into FlyingCards for layout precision */}
            </main>

            <footer className="fixed bottom-8 left-0 right-0 text-center text-white/20 text-xs pointer-events-none z-50">
                Changing How You Use Cards
            </footer>
        </div>
    );
}

export default LandingPage;
