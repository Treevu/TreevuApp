import { CategoriaGasto, TreevuLevel } from '../types/common';
import { Reward } from '../types/user';
import { Challenge, AgeRange, DEPARTMENTS, MODALITIES, TENURES, AGE_RANGES, Department, Tenure } from '../types/employer';

// Enhanced mock data for employees, including rewards information.
export interface EmployerEmployee {
    id: number;
    department: 'Ventas y Marketing' | 'Tecnología e Innovación' | 'Operaciones y Logística' | 'Finanzas y Contabilidad' | 'Recursos Humanos' | 'Administración y Legal' | 'Dirección Ejecutiva';
    modality: 'Presencial' | 'Híbrido' | 'Remoto';
    tenure: '< 1 año' | '1-5 años' | '> 5 años';
    ageRange: AgeRange;
    formalSpending: number;
    informalSpending: number;
    treevusEarned: number;
    redeemedRewards: { category: Reward['category']; cost: number }[];
    level: TreevuLevel;
    spendingByCategory: { [key in CategoriaGasto]?: number };
    goals: {
        name: 'Viaje' | 'Educación' | 'Vivienda' | 'Fondo de Emergencia' | 'Otro';
        targetAmount: number;
        currentAmount: number;
    }[];
    kudosSent: number;
    kudosReceived: number;
    completedLessons: string[];
}

export const MOCK_CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: 'Impulso de Formalidad Q3',
        description: 'Aumentar el % de gastos formales para maximizar el ahorro fiscal del equipo.',
        targetMetric: 'formalityScore',
        targetValue: 85,
        department: 'all',
        reward: 'Bono de 500 treevüs para cada miembro',
    },
    {
        id: '2',
        title: 'Competencia de Bienestar: Ventas',
        description: 'Alcanzar un FWI promedio superior para ganar el premio trimestral.',
        targetMetric: 'financialWellnessIndex',
        targetValue: 80,
        department: 'Ventas y Marketing',
        reward: 'Almuerzo de equipo pagado',
    },
    {
        id: '3',
        title: 'Iniciativa Equilibrio: Tec & Innovación',
        description: 'Mejorar el FWI del área de Tecnología a través de un mejor balance de vida-trabajo, moderando gastos de consumo rápido.',
        targetMetric: 'financialWellnessIndex',
        targetValue: 78,
        department: 'Tecnología e Innovación',
        reward: 'Créditos para apps de meditación y fitness',
    },
    {
        id: '4',
        title: 'Desafío del Conocimiento',
        description: 'Impulsar el desarrollo profesional de toda la empresa, incentivando la inversión en educación.',
        targetMetric: 'financialWellnessIndex',
        targetValue: 75,
        department: 'all',
        reward: 'Acceso a un curso premium de Platzi o Coursera',
    }
];

// Employee Archetypes for more realistic data
const archetypes = {
    SAVVY_SAVER: { formality: 0.9, leisureRatio: 0.1, devRatio: 0.05, goalAdoption: 0.9, kudosRatio: 0.4 },
    BIG_SPENDER: { formality: 0.4, leisureRatio: 0.4, devRatio: 0.01, goalAdoption: 0.2, kudosRatio: 0.7 },
    BALANCED_PROFESSIONAL: { formality: 0.75, leisureRatio: 0.25, devRatio: 0.03, goalAdoption: 0.6, kudosRatio: 0.6 },
    NEW_JOINER: { formality: 0.5, leisureRatio: 0.2, devRatio: 0.02, goalAdoption: 0.4, kudosRatio: 0.5 },
};

export const generateMockEmployees = (count: number): EmployerEmployee[] => {
    return Array.from({ length: count }, (_, i) => {
        const rewardCats: Reward['category'][] = ['Bienestar', 'Educación', 'Ocio', 'Impacto Social'];
        type GoalCategory = 'Viaje' | 'Educación' | 'Vivienda' | 'Fondo de Emergencia' | 'Otro';
        const goalCats: GoalCategory[] = ['Viaje', 'Educación', 'Vivienda', 'Fondo de Emergencia', 'Otro'];

        const department = DEPARTMENTS[i % DEPARTMENTS.length];
        const modality = MODALITIES[i % MODALITIES.length];
        const tenure = TENURES[i % TENURES.length];
        const ageRange = AGE_RANGES[i % AGE_RANGES.length];
        
        // --- Enhanced Archetype Assignment ---
        const getArchetype = (department: Department, tenure: Tenure) => {
            const rand = Math.random();
            switch (department) {
                case 'Finanzas y Contabilidad':
                    return rand < 0.7 ? archetypes.SAVVY_SAVER : archetypes.BALANCED_PROFESSIONAL;
                case 'Ventas y Marketing':
                    return rand < 0.6 ? archetypes.BIG_SPENDER : archetypes.BALANCED_PROFESSIONAL;
                case 'Tecnología e Innovación':
                    return rand < 0.5 ? archetypes.BALANCED_PROFESSIONAL : rand < 0.8 ? archetypes.SAVVY_SAVER : archetypes.BIG_SPENDER;
                default:
                    if (tenure === '< 1 año') return archetypes.NEW_JOINER;
                    return rand < 0.6 ? archetypes.BALANCED_PROFESSIONAL : rand < 0.85 ? archetypes.SAVVY_SAVER : archetypes.BIG_SPENDER;
            }
        };
        const archetype = getArchetype(department, tenure);

        const totalSpending = 1200 + Math.random() * 2500; // Increased base spending
        const formalSpending = totalSpending * (archetype.formality + (Math.random() - 0.5) * 0.15); // Slightly less variance
        const informalSpending = totalSpending - formalSpending;
        
        // --- Richer Spending Patterns ---
        const spendingCats: { [key in CategoriaGasto]?: number } = {};
        spendingCats[CategoriaGasto.Alimentacion] = totalSpending * (0.25 + (Math.random() - 0.5) * 0.1);
        spendingCats[CategoriaGasto.Vivienda] = totalSpending * (0.20 + (Math.random() - 0.5) * 0.1);
        spendingCats[CategoriaGasto.Transporte] = totalSpending * (modality === 'Presencial' ? 0.15 : 0.05);
        spendingCats[CategoriaGasto.Servicios] = totalSpending * 0.1;
        const essentialSpending = Object.values(spendingCats).reduce((a, b) => a + (b || 0), 0);
        const discretionarySpending = totalSpending - essentialSpending;

        if (discretionarySpending > 0) {
            spendingCats[CategoriaGasto.Ocio] = discretionarySpending * (archetype.leisureRatio + (Math.random() - 0.5) * 0.2);
            spendingCats[CategoriaGasto.Educacion] = discretionarySpending * (archetype.devRatio + (Math.random() - 0.5) * 0.1);
            spendingCats[CategoriaGasto.Consumos] = Math.max(0, discretionarySpending - (spendingCats[CategoriaGasto.Ocio]! + spendingCats[CategoriaGasto.Educacion]!));
        }

        // --- More Rewards ---
        const redeemedRewards = [];
        const redemptionChance = 0.45; // 45% chance to have redeemed at least one
        if (Math.random() < redemptionChance) {
            const numRewards = Math.random() < 0.3 ? 2 : 1; // 30% chance of 2 rewards
            for (let j = 0; j < numRewards; j++) {
                redeemedRewards.push({
                    category: rewardCats[(i + j) % rewardCats.length],
                    cost: 800 + Math.random() * 2000,
                });
            }
        }

        // --- More Varied Goals ---
        const goals = [];
        if (Math.random() < archetype.goalAdoption) {
            const numGoals = Math.random() > 0.6 ? 2 : 1; // More likely to have multiple goals
            for (let j = 0; j < numGoals; j++) {
                const targetAmount = 2000 + Math.random() * 20000;
                let goalType: GoalCategory = goalCats[(i + j) % goalCats.length];
                // Tie goal type to age/archetype
                if (archetype === archetypes.SAVVY_SAVER) goalType = 'Fondo de Emergencia';
                if (['18-24', '25-29'].includes(ageRange)) goalType = Math.random() < 0.5 ? 'Viaje' : 'Educación';
                if (['40-49', '50-59'].includes(ageRange)) goalType = 'Vivienda';

                goals.push({
                    name: goalType,
                    targetAmount: targetAmount,
                    currentAmount: targetAmount * (0.1 + Math.random() * 0.85), // Higher progress variance
                });
            }
        }
        
        // --- More Varied Kudos ---
        let kudosMultiplier = 1;
        if (department === 'Tecnología e Innovación' || department === 'Ventas y Marketing') {
            kudosMultiplier = 1.5;
        }

        // --- Completed Lessons ---
        const lessonIds = ['intro', 'accelerate', 'how-it-works', 'formality'];
        const completedLessons = lessonIds.slice(0, Math.floor(Math.random() * (lessonIds.length + 1)));


        return {
            id: i + 1,
            department,
            modality,
            tenure,
            ageRange,
            formalSpending,
            informalSpending,
            treevusEarned: Math.floor(formalSpending / 2 + (goals.length * 100) + (redeemedRewards.length * 50)),
            redeemedRewards,
            level: TreevuLevel.Plantón + Math.floor(Math.random() * 3) as TreevuLevel, // More level variance
            spendingByCategory: spendingCats,
            goals,
            kudosSent: Math.floor(Math.random() * 60 * archetype.kudosRatio * kudosMultiplier),
            kudosReceived: Math.floor(Math.random() * 60 * archetype.kudosRatio * kudosMultiplier),
            completedLessons,
        }
    });
};

export const MOCK_EMPLOYEES = generateMockEmployees(195);
export const TOTAL_COMPANY_EMPLOYEES = 250; // Total employees in the company
export const DEPARTMENT_TOTALS = { // Total employees per department for activation calculation
    'Ventas y Marketing': 35,
    'Tecnología e Innovación': 30,
    'Operaciones y Logística': 45,
    'Finanzas y Contabilidad': 25,
    'Recursos Humanos': 20,
    'Administración y Legal': 15,
    'Dirección Ejecutiva': 10
};

 const getFwiForEmployee = (employee: EmployerEmployee) => {
    const empTotalSpending = employee.formalSpending + employee.informalSpending;
    const empFormality = empTotalSpending > 0 ? (employee.formalSpending / empTotalSpending) : 0;
    const empLeisure = employee.spendingByCategory[CategoriaGasto.Ocio] || 0;
    const empEssential = (employee.spendingByCategory[CategoriaGasto.Transporte] || 0) + (employee.spendingByCategory[CategoriaGasto.Alimentacion] || 0);
    const empBalance = empEssential > 0 ? Math.min(1, (empLeisure / empEssential) * 2) : 0.5;
    const empSelfDev = Math.min(1, (employee.spendingByCategory[CategoriaGasto.Educacion] || 0) / 100);
    return (empFormality * 0.5 + empBalance * 0.3 + empSelfDev * 0.2) * 100;
};

// Helper function to calculate metrics for any given segment
const _calculateMetricsForSegment = (segment: EmployerEmployee[], totalEmployeesInSegment: number) => {
    if (segment.length === 0) return null;

    // FWI Component Calculations
    const totalFormalSpending = segment.reduce((sum, e) => sum + e.formalSpending, 0);
    const totalInformalSpending = segment.reduce((sum, e) => sum + e.informalSpending, 0);
    const totalSpending = totalFormalSpending + totalInformalSpending;
    const formalityScore = totalSpending > 0 ? (totalFormalSpending / totalSpending) : 0;
    
    const leisureSpending = segment.reduce((sum, e) => sum + (e.spendingByCategory[CategoriaGasto.Ocio] || 0), 0);
    const essentialSpendingForBalance = segment.reduce((sum, e) => sum + (e.spendingByCategory[CategoriaGasto.Transporte] || 0) + (e.spendingByCategory[CategoriaGasto.Alimentacion] || 0), 0);
    const workLifeBalanceScore = essentialSpendingForBalance > 0 ? Math.min(1, (leisureSpending / essentialSpendingForBalance) * 2) : 0.5;
    
    const selfDevSpending = segment.reduce((sum, e) => sum + (e.spendingByCategory[CategoriaGasto.Educacion] || 0), 0);
    const selfDevScore = Math.min(1, selfDevSpending / (segment.length * 100));

    // Spending Intent Calculation
    const essentialCategories: CategoriaGasto[] = [CategoriaGasto.Vivienda, CategoriaGasto.Alimentacion, CategoriaGasto.Transporte, CategoriaGasto.Salud, CategoriaGasto.Servicios, CategoriaGasto.Educacion];
    const spendingIntentTotals = segment.reduce((acc, e) => {
        for (const [category, amount] of Object.entries(e.spendingByCategory)) {
            if (amount) {
                if (essentialCategories.includes(category as CategoriaGasto)) acc.essential += amount;
                else acc.desired += amount;
            }
        }
        return acc;
    }, { essential: 0, desired: 0 });
    const totalIntentSpending = spendingIntentTotals.essential + spendingIntentTotals.desired;
    const essentialPercent = totalIntentSpending > 0 ? (spendingIntentTotals.essential / totalIntentSpending) * 100 : 0;
    
    // Updated Flight Risk Score
    const flightRiskScore = (1 - formalityScore) * 0.35 + (1 - workLifeBalanceScore) * 0.35 + (essentialPercent / 100) * 0.2 + (1 - selfDevScore) * 0.1;
    const talentFlightRisk: 'Bajo' | 'Medio' | 'Alto' = flightRiskScore > 0.6 ? 'Alto' : flightRiskScore > 0.35 ? 'Medio' : 'Bajo';
    
    const employeesWhoRedeemed = segment.filter(e => e.redeemedRewards.length > 0);
    const redemptionRate = (employeesWhoRedeemed.length / segment.length) * 100;
    
    const rawActivationRate = totalEmployeesInSegment > 0 ? (segment.length / totalEmployeesInSegment) * 100 : 0;
    const activationRate = Math.min(100, rawActivationRate);

    return {
        fwi: (formalityScore * 0.5 + workLifeBalanceScore * 0.3 + selfDevScore * 0.2) * 100,
        flightRiskScore: flightRiskScore * 100,
        talentFlightRisk,
        redemptionRate,
        activationRate,
        rawActivationRate,
        formalityScore: formalityScore * 100,
        workLifeBalanceScore: workLifeBalanceScore * 100,
        selfDevScore: selfDevScore * 100,
        essentialPercent,
        spendingIntentTotals,
    };
};


export const calculateKpisForSegment = (employeeSegment: EmployerEmployee[]) => {
    if (employeeSegment.length === 0) {
         return {
            isEmpty: true,
            financialWellnessIndex: 0,
            fwiComponents: [],
            formalityScore: 0,
            workLifeBalanceScore: 0,
            selfDevScore: 0,
            benefitsROI: 0,
            roiMultiplier: 0,
            talentFlightRisk: 'Bajo' as 'Bajo' | 'Medio' | 'Alto',
            flightRiskScore: 0,
            fiscalEfficiency: 100,
            spendingByCategory: [],
            activationRate: 0,
            rawActivationRate: 0,
            avgSpendingPerUser: 0,
            dashboardViews: 0,
            redemptionRate: 0,
            earnVelocity: 0,
            rewardCategoryDistribution: [],
            fwiComparison: { redeemers: 0, nonRedeemers: 0 },
            goalAdoptionRate: 0,
            avgGoalProgress: 0,
            avgGoalAmount: 0,
            topGoalCategories: [],
            fwiWithGoalsVsWithout: { withGoals: 0, withoutGoals: 0 },
            fwiCorrelations: [],
            kpisByDepartment: [],
            kudosLeaderboard: [],
            wellnessHeatmapData: [],
            teamAchievements: [],
            filteredActiveEmployees: 0,
            fwiHistory: [],
            companyWideFwi: 0,
            companyWideFwiHistory: [],
            flightRiskHistory: [],
            roiHistory: [],
            goalAdoptionRateHistory: [],
            avgGoalProgressHistory: [],
            avgGoalAmountHistory: [],
            kudosHistory: [],
            avgLessonsCompletedHistory: [],
            activationRateHistory: [],
            essentialVsDesiredBreakdown: { essential: 0, desired: 0, essentialPercent: 0, desiredPercent: 0, insight: '' },
            learningEngagement: { completionByDept: [], topLessons: [] },
            insightsByModality: [],
            gamification: { totalKudosSent: 0, totalKudosReceived: 0, avgLessonsCompleted: 0, levelDistribution: {}, avgLevel: 0, totalEmployees: 0 },
            redemptionRateHistory: [],
            avgProfessionalDevelopmentSpending: 0,
            avgWorkLifeBalanceSpending: 0,
            avgProfDevSpendingHistory: [],
            avgWlbSpendingHistory: [],
            avgLevelHistory: [],
            totalRedeemedValueHistory: [],
        };
    }

    const mainMetrics = _calculateMetricsForSegment(employeeSegment, TOTAL_COMPANY_EMPLOYEES)!;
    const { fwi: financialWellnessIndex, flightRiskScore, formalityScore, workLifeBalanceScore, selfDevScore, talentFlightRisk, activationRate, rawActivationRate, essentialPercent, spendingIntentTotals, redemptionRate } = mainMetrics;

    const fwiComponents = [
        { name: 'Salud Financiera', value: formalityScore, weight: 0.5 },
        { name: 'Balance Vida-Trabajo', value: workLifeBalanceScore, weight: 0.3 },
        { name: 'Des. Profesional', value: selfDevScore, weight: 0.2 },
    ];
    
    const companyWideFwi = MOCK_EMPLOYEES.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / MOCK_EMPLOYEES.length;

    const totalSpending = employeeSegment.reduce((sum, e) => sum + e.formalSpending + e.informalSpending, 0);
    const avgSpendingPerUser = totalSpending / employeeSegment.length;
    
    const THREEVU_TO_SOLES_RATE = 0.025; 
    const benefitsROI = employeeSegment.reduce((sum, e) => sum + e.redeemedRewards.reduce((rSum, r) => rSum + (r.cost * THREEVU_TO_SOLES_RATE), 0), 0);
    const PROGRAM_COST_PER_USER = 10;
    const programCost = employeeSegment.length * PROGRAM_COST_PER_USER;
    const roiMultiplier = programCost > 0 ? benefitsROI / programCost : 0;
    
    const employeesWithGoals = employeeSegment.filter(e => e.goals && e.goals.length > 0);
    const goalAdoptionRate = employeeSegment.length > 0 ? (employeesWithGoals.length / employeeSegment.length) * 100 : 0;
    const allGoals = employeeSegment.flatMap(e => e.goals || []);
    const totalProgressSum = allGoals.reduce((sum, goal) => (goal.targetAmount > 0 ? sum + (goal.currentAmount / goal.targetAmount) : sum), 0);
    const avgGoalProgress = allGoals.length > 0 ? (totalProgressSum / allGoals.length) * 100 : 0;
    const totalTargetAmount = allGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const avgGoalAmount = allGoals.length > 0 ? totalTargetAmount / allGoals.length : 0;
    const totalKudosSent = employeeSegment.reduce((sum, e) => sum + e.kudosSent, 0);
    const totalKudosReceived = employeeSegment.reduce((sum, e) => sum + e.kudosReceived, 0);
    const totalLessonsCompleted = employeeSegment.reduce((sum, e) => sum + e.completedLessons.length, 0);
    const avgLessonsCompleted = employeeSegment.length > 0 ? (totalLessonsCompleted / employeeSegment.length) : 0;
    const avgProfessionalDevelopmentSpending = employeeSegment.reduce((sum, e) => sum + (e.spendingByCategory?.[CategoriaGasto.Educacion] || 0), 0) / employeeSegment.length;
    const avgWorkLifeBalanceSpending = employeeSegment.reduce((sum, e) => sum + (e.spendingByCategory?.[CategoriaGasto.Ocio] || 0), 0) / employeeSegment.length;


    // --- HISTORICAL DATA SIMULATION ---
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const now = new Date();
    const fwiHistory: { month: string; value: number }[] = [];
    const companyWideFwiHistory: { month: string; value: number }[] = [];
    const flightRiskHistory: { month: string; value: number }[] = [];
    const roiHistory: { month: string; value: number }[] = [];
    const goalAdoptionRateHistory: { month: string; value: number }[] = [];
    const avgGoalProgressHistory: { month: string; value: number }[] = [];
    const avgGoalAmountHistory: { month: string; value: number }[] = [];
    const kudosHistory: { month: string; value: number }[] = [];
    const avgLessonsCompletedHistory: { month: string; value: number }[] = [];
    const activationRateHistory: { month: string; value: number }[] = [];
    const redemptionRateHistory: { month: string; value: number }[] = [];
    const avgProfDevSpendingHistory: { month: string; value: number }[] = [];
    const avgWlbSpendingHistory: { month: string; value: number }[] = [];
    const avgLevelHistory: { month: string; value: number }[] = [];
    const totalRedeemedValueHistory: { month: string; value: number }[] = [];

    const totalLevelSum = employeeSegment.reduce((sum, e) => sum + e.level, 0);
    const avgLevel = employeeSegment.length > 0 ? totalLevelSum / employeeSegment.length : 0;
    
    for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = monthNames[d.getMonth()];
        const isCurrentMonth = i === 0;
        const trendMultiplier = i; // Larger number for older months

        const addNoise = (value: number, amount: number) => value + (Math.random() - 0.5) * amount;

        // Simulate FWI with a general upward trend
        fwiHistory.push({ month, value: addNoise(isCurrentMonth ? financialWellnessIndex : financialWellnessIndex - trendMultiplier * 1.5, 2) });
        companyWideFwiHistory.push({ month, value: addNoise(isCurrentMonth ? companyWideFwi : companyWideFwi - trendMultiplier * 0.5, 1) });
        flightRiskHistory.push({ month, value: addNoise(isCurrentMonth ? flightRiskScore : flightRiskScore + trendMultiplier * 1.5, 2) });
        roiHistory.push({ month, value: addNoise(isCurrentMonth ? roiMultiplier : roiMultiplier - trendMultiplier * 0.2, 0.1) });
        goalAdoptionRateHistory.push({ month, value: addNoise(isCurrentMonth ? goalAdoptionRate : goalAdoptionRate - trendMultiplier * 2, 3) });
        avgGoalProgressHistory.push({ month, value: addNoise(isCurrentMonth ? avgGoalProgress : avgGoalProgress - trendMultiplier * 3, 4) });
        avgGoalAmountHistory.push({ month, value: addNoise(isCurrentMonth ? avgGoalAmount : avgGoalAmount - trendMultiplier * 100, 200) });
        const currentTotalKudos = totalKudosSent + totalKudosReceived;
        kudosHistory.push({ month, value: addNoise(isCurrentMonth ? currentTotalKudos : currentTotalKudos - trendMultiplier * 20, 10) });
        avgLessonsCompletedHistory.push({ month, value: addNoise(isCurrentMonth ? avgLessonsCompleted : avgLessonsCompleted - trendMultiplier * 0.2, 0.1) });
        activationRateHistory.push({ month, value: addNoise(isCurrentMonth ? activationRate : activationRate - trendMultiplier * 2.5, 3) });
        redemptionRateHistory.push({ month, value: addNoise(isCurrentMonth ? redemptionRate : redemptionRate - trendMultiplier * 1.5, 2) });
        avgProfDevSpendingHistory.push({ month, value: addNoise(isCurrentMonth ? avgProfessionalDevelopmentSpending : avgProfessionalDevelopmentSpending - trendMultiplier * 5, 10) });
        avgWlbSpendingHistory.push({ month, value: addNoise(isCurrentMonth ? avgWorkLifeBalanceSpending : avgWorkLifeBalanceSpending - trendMultiplier * 10, 20) });
        avgLevelHistory.push({ month, value: addNoise(isCurrentMonth ? avgLevel : avgLevel - trendMultiplier * 0.1, 0.05) });
        totalRedeemedValueHistory.push({ month, value: addNoise(isCurrentMonth ? benefitsROI : benefitsROI - trendMultiplier * 50, 25) });
    }
    
    const kpisByDepartment = DEPARTMENTS.map(dept => {
        const deptEmployees = employeeSegment.filter(e => e.department === dept);
        const totalDeptPopulation = DEPARTMENT_TOTALS[dept as keyof typeof DEPARTMENT_TOTALS] || 0;
        
        const deptMetrics = _calculateMetricsForSegment(deptEmployees, totalDeptPopulation);
        return {
            department: dept,
            ...deptMetrics,
        };
    }).filter(d => d.fwi != null);

    const spendingByCategory = employeeSegment.reduce((acc, e) => {
        for (const [category, amount] of Object.entries(e.spendingByCategory)) {
            if (amount) acc[category] = (acc[category] || 0) + amount;
        }
        return acc;
    }, {} as Record<string, number>);

    const dashboardViews = employeeSegment.length * (5 + Math.floor(Math.random() * 20));

    const totalTreevusEarned = employeeSegment.reduce((sum, e) => sum + e.treevusEarned, 0);
    const earnVelocity = totalTreevusEarned / employeeSegment.length;
    
    const rewardCategoryDistribution = employeeSegment
        .flatMap(e => e.redeemedRewards)
        .reduce((acc, reward) => {
            acc[reward.category] = (acc[reward.category] || 0) + (reward.cost * THREEVU_TO_SOLES_RATE);
            return acc;
        }, {} as Record<string, number>);

    const redeemers = employeeSegment.filter(e => e.redeemedRewards.length > 0);
    const nonRedeemers = employeeSegment.filter(e => e.redeemedRewards.length === 0);
    
    const avgFwiRedeemers = redeemers.length > 0 ? redeemers.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / redeemers.length : 0;
    const avgFwiNonRedeemers = nonRedeemers.length > 0 ? nonRedeemers.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / nonRedeemers.length : 0;
        
    const goalCounts = allGoals.reduce((acc, goal) => {
        acc[goal.name] = (acc[goal.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topGoalCategories = Object.entries(goalCounts).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);
    
    const employeesWithoutGoals = employeeSegment.filter(e => !e.goals || e.goals.length === 0);
    const avgFwiWithGoals = employeesWithGoals.length > 0 ? employeesWithGoals.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / employeesWithGoals.length : 0;
    const avgFwiWithoutGoals = employeesWithoutGoals.length > 0 ? employeesWithoutGoals.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / employeesWithoutGoals.length : 0;

    const fwiCorrelations = [ { label: 'Riesgo de Fuga', value: -0.85 }, { label: 'ROI del Programa', value: 0.72 }, { label: 'Adopción de Metas', value: 0.68 }, { label: 'Tasa de Activación', value: 0.55 }, { label: 'Velocidad de Acumulación', value: 0.48 }, ].sort((a,b) => Math.abs(b.value) - Math.abs(a.value));
    
    const kudosLeaderboard = DEPARTMENTS.map(dept => {
        const deptEmployees = employeeSegment.filter(e => e.department === dept);
        const totalKudos = deptEmployees.reduce((sum, e) => sum + e.kudosSent + e.kudosReceived, 0);
        return { department: dept, kudos: totalKudos };
    }).sort((a,b) => b.kudos - a.kudos);

    const wellnessHeatmapData = DEPARTMENTS.map(department => {
        const row: { department: Department, values: { [key in Tenure]: number } } = { department, values: { '< 1 año': 0, '1-5 años': 0, '> 5 años': 0 } };
        TENURES.forEach(tenure => {
            const segment = employeeSegment.filter(e => e.department === department && e.tenure === tenure);
            row.values[tenure] = segment.length > 0 ? segment.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / segment.length : 45 + Math.random() * 45;
        });
        return row;
    });
    
    const teamAchievements = [ { id: '1', icon: '🎯', title: 'Misión: 1,000 Gastos', description: 'El equipo ha registrado colectivamente 1,000 gastos formales este mes.', achieved: true }, { id: '2', icon: '🔥', title: 'Racha de Equipo', description: '7 días consecutivos de registros por parte de todo el equipo.', achieved: true }, { id: '3', icon: '💰', title: 'Meta de Ahorro Colectiva', description: 'Alcanzada la meta de ahorro de equipo para Q3.', achieved: false }, { id: '4', icon: '🤝', title: 'Cultura de Kudos', description: 'Se han enviado más de 500 kudos entre compañeros.', achieved: true }, ];

    const totalIntentSpending = spendingIntentTotals.essential + spendingIntentTotals.desired;
    const desiredPercent = totalIntentSpending > 0 ? (spendingIntentTotals.desired / totalIntentSpending) * 100 : 0;
    let fsiInsight = "El equipo muestra un balance saludable entre sus gastos esenciales y deseados.";
    if (essentialPercent > 75) fsiInsight = "Una alta proporción de gastos es 'esencial', lo que puede indicar estrés financiero. Considera revisar la compensación o beneficios de primera necesidad.";
    else if (desiredPercent > 50) fsiInsight = "Una parte significativa del gasto es 'deseado', lo que indica holgura financiera. Es una oportunidad para fomentar el ahorro y la inversión.";

    const essentialVsDesiredBreakdown = { ...spendingIntentTotals, essentialPercent, desiredPercent, insight: fsiInsight };

    const allCompletedLessons = employeeSegment.flatMap(e => e.completedLessons);
    const lessonCounts = allCompletedLessons.reduce((acc, lessonId) => { acc[lessonId] = (acc[lessonId] || 0) + 1; return acc; }, {} as Record<string, number>);
    const topLessons = Object.entries(lessonCounts).map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count).slice(0, 3);
    const completionByDept = DEPARTMENTS.map(dept => {
        const deptEmployees = employeeSegment.filter(e => e.department === dept);
        if (deptEmployees.length === 0) return { department: dept, rate: 0 };
        const totalLessonsCompleted = deptEmployees.reduce((sum, e) => sum + e.completedLessons.length, 0);
        const rate = (totalLessonsCompleted / deptEmployees.length) / 4 * 100;
        return { department: dept, rate };
    }).sort((a,b) => b.rate - a.rate);
    const learningEngagement = { completionByDept, topLessons };
    
    const insightsByModality = MODALITIES.map(modality => {
        const segment = employeeSegment.filter(e => e.modality === modality);
        if (segment.length < 3) return { modality, fwi: 0, topCategories: [], employeeCount: segment.length, intentBreakdown: { essentialPercent: 0, desiredPercent: 0 }, };
        const fwi = segment.reduce((sum, e) => sum + getFwiForEmployee(e), 0) / segment.length;
        const spending = segment.reduce((acc, e) => {
            for (const [category, amount] of Object.entries(e.spendingByCategory)) { if (amount) acc[category] = (acc[category] || 0) + amount; }
            return acc;
        }, {} as Record<string, number>);
        const topCategories = Object.entries(spending).map(([category, amount]) => ({ category: category as CategoriaGasto, amount })).sort((a, b) => b.amount - a.amount).slice(0, 3);
        const essentialCategories: CategoriaGasto[] = [CategoriaGasto.Vivienda, CategoriaGasto.Alimentacion, CategoriaGasto.Transporte, CategoriaGasto.Salud, CategoriaGasto.Servicios, CategoriaGasto.Educacion];
        const intentTotals = segment.reduce((acc, e) => {
            for (const [category, amount] of Object.entries(e.spendingByCategory)) { if (amount) { if (essentialCategories.includes(category as CategoriaGasto)) acc.essential += amount; else acc.desired += amount; } }
            return acc;
        }, { essential: 0, desired: 0 });
        const totalIntent = intentTotals.essential + intentTotals.desired;
        return { modality, fwi, topCategories, employeeCount: segment.length, intentBreakdown: { essentialPercent: totalIntent > 0 ? (intentTotals.essential / totalIntent) * 100 : 0, desiredPercent: totalIntent > 0 ? (intentTotals.desired / totalIntent) * 100 : 0 }, };
    });
    
    const levelDistribution = employeeSegment.reduce((acc, e) => {
        const levelName = Object.keys(TreevuLevel).find(key => TreevuLevel[key as keyof typeof TreevuLevel] === e.level) || 'Brote';
        acc[levelName] = (acc[levelName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);


    return {
        isEmpty: false, financialWellnessIndex, fwiComponents, flightRiskScore, formalityScore, workLifeBalanceScore, selfDevScore, benefitsROI, roiMultiplier, talentFlightRisk,
        spendingByCategory: Object.entries(spendingByCategory).map(([category, amount]) => ({ category: category as CategoriaGasto, amount })).sort((a, b) => b.amount - a.amount),
        activationRate, rawActivationRate, avgSpendingPerUser, dashboardViews, redemptionRate, earnVelocity,
        rewardCategoryDistribution: Object.entries(rewardCategoryDistribution).map(([category, amount]) => ({ category: category as Reward['category'], amount })).sort((a, b) => b.amount - a.amount),
        fwiComparison: { redeemers: avgFwiRedeemers, nonRedeemers: avgFwiNonRedeemers },
        goalAdoptionRate, avgGoalProgress, avgGoalAmount, topGoalCategories, fwiWithGoalsVsWithout: { withGoals: avgFwiWithGoals, withoutGoals: avgFwiWithoutGoals },
        fwiCorrelations, kpisByDepartment, kudosLeaderboard, wellnessHeatmapData, teamAchievements, filteredActiveEmployees: employeeSegment.length, 
        fwiHistory, companyWideFwi, companyWideFwiHistory, flightRiskHistory, roiHistory,
        goalAdoptionRateHistory, avgGoalProgressHistory, avgGoalAmountHistory, kudosHistory, avgLessonsCompletedHistory, activationRateHistory,
        essentialVsDesiredBreakdown, learningEngagement, insightsByModality,
        gamification: { totalKudosSent, totalKudosReceived, avgLessonsCompleted, levelDistribution, avgLevel, totalEmployees: employeeSegment.length },
        redemptionRateHistory,
        avgProfessionalDevelopmentSpending, avgWorkLifeBalanceSpending, avgProfDevSpendingHistory, avgWlbSpendingHistory,
        avgLevelHistory,
        totalRedeemedValueHistory,
    };
};