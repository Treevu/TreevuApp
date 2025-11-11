#!/bin/bash

echo "🔧 Fixing remaining import paths..."

# Update ModalContext.tsx with correct paths
cd src/contexts
sed -i '' 's|@/components/ThreevusInfoModal|@/features/gamification/ThreevusInfoModal|g' ModalContext.tsx
sed -i '' 's|@/components/RewardConfirmationModal|@/features/gamification/RewardConfirmationModal|g' ModalContext.tsx
sed -i '' 's|@/components/MerchantDetailModal|@/features/expenses/MerchantDetailModal|g' ModalContext.tsx
sed -i '' 's|@/components/employer/|@/features/employer/|g' ModalContext.tsx
sed -i '' 's|@/components/AddGoalContributionModal|@/features/goals/AddGoalContributionModal|g' ModalContext.tsx
sed -i '' 's|@/components/NotificationCenter|@/features/notifications/NotificationCenter|g' ModalContext.tsx
sed -i '' 's|@/components/SendKudosModal|@/features/social/SendKudosModal|g' ModalContext.tsx
sed -i '' 's|@/components/PersonalizationModal|@/features/profile/PersonalizationModal|g' ModalContext.tsx
sed -i '' 's|@/components/PrestigeModal|@/features/gamification/PrestigeModal|g' ModalContext.tsx

echo "✅ ModalContext.tsx imports fixed"

# Fix other context files
cd ../

echo "🔧 Fixing all remaining import paths in src/..."

# Fix any remaining relative imports
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '\.\./\.\./\.\." | while read file; do
    echo "Fixing $file"
    sed -i '' 's|from '\''\.\./\.\./\.\./components/|from '\''@/components/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./\.\./features/|from '\''@/features/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./\.\./contexts/|from '\''@/contexts/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./\.\./types/|from '\''@/types/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./\.\./hooks/|from '\''@/hooks/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./\.\./services/|from '\''@/services/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./\.\./utils/|from '\''@/utils/|g' "$file"
done

# Fix double dot imports
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '\.\./\.\." | while read file; do
    echo "Fixing $file"
    sed -i '' 's|from '\''\.\./\.\./components/|from '\''@/components/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./features/|from '\''@/features/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./contexts/|from '\''@/contexts/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./types/|from '\''@/types/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./hooks/|from '\''@/hooks/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./services/|from '\''@/services/|g' "$file"
    sed -i '' 's|from '\''\.\./\.\./utils/|from '\''@/utils/|g' "$file"
done

echo "✅ All import paths fixed!"