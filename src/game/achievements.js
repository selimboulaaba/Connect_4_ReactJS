import {
  Trophy, Swords, Crown, Medal, Flame, Rocket, Zap, AlarmClock, Building2, TrendingUp, Target, RotateCcw,
  Shield, Grid3x3, Footprints, Award, Users, Puzzle, Brain, Star, Sparkles,
} from 'lucide-react'

// Mirrors back/src/utils/achievements.js (the server decides who earns what).
export const ACHIEVEMENT_GROUPS = [
  {
    title: 'Winning',
    items: [
      { id: 'first_win', label: 'First win', desc: 'Win your first round', icon: Trophy },
      { id: 'ten_wins', label: 'Veteran', desc: 'Win 10 rounds', icon: Swords },
      { id: 'fifty_wins', label: 'Champion', desc: 'Win 50 rounds', icon: Crown },
      { id: 'hundred_wins', label: 'Centurion', desc: 'Win 100 rounds', icon: Medal },
      { id: 'streak_5', label: 'Hot streak', desc: 'Win 5 rounds in a row', icon: Flame },
      { id: 'streak_10', label: 'Unstoppable', desc: 'Win 10 rounds in a row', icon: Rocket },
    ],
  },
  {
    title: 'How you win',
    items: [
      { id: 'speedrun', label: 'Speedrun', desc: 'Win a round in 15 moves or fewer', icon: Zap },
      { id: 'buzzer', label: 'Buzzer beater', desc: 'Win with under 5 seconds left on your clock', icon: AlarmClock },
      { id: 'skyscraper', label: 'Skyscraper', desc: 'Win with four discs stacked in one column', icon: Building2 },
      { id: 'diagonal', label: 'Sharp angle', desc: 'Win with a diagonal line', icon: TrendingUp },
      { id: 'giant_slayer', label: 'Giant slayer', desc: 'Beat a player 5 or more levels above you', icon: Target },
      { id: 'comeback', label: 'Comeback', desc: 'Win a round while 2 points behind in the match', icon: RotateCcw },
      { id: 'shutout', label: 'Shutout', desc: 'Lead a match 3–0', icon: Shield },
    ],
  },
  {
    title: 'Playing',
    items: [
      { id: 'stalemate', label: 'Stalemate', desc: 'Fill the whole board without a winner', icon: Grid3x3 },
      { id: 'marathon', label: 'Marathon', desc: 'Play 100 online rounds', icon: Footprints },
      { id: 'tournament_champion', label: 'Tournament champion', desc: 'Win a four-player tournament', icon: Award },
      { id: 'social', label: 'Squad', desc: 'Add 5 friends', icon: Users },
    ],
  },
  {
    title: 'Puzzles and levels',
    items: [
      { id: 'puzzler', label: 'Puzzler', desc: 'Solve a daily puzzle', icon: Puzzle },
      { id: 'puzzle_master', label: 'Puzzle master', desc: 'Solve 7 daily puzzles', icon: Brain },
      { id: 'level_5', label: 'Rising star', desc: 'Reach level 5', icon: Star },
      { id: 'level_10', label: 'Legend', desc: 'Reach level 10', icon: Sparkles },
    ],
  },
]

export const ACHIEVEMENTS = ACHIEVEMENT_GROUPS.flatMap((g) => g.items)
