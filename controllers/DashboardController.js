const { Op, fn, col, literal } = require("sequelize");
const { Users, Booking, Payment } = require("../models")

exports.overall = async (req,res) => {
    const totalUsers = await Users.count();
    const usersByMonth = await Users.findAll({
    attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
        [fn('COUNT', col('id')), 'count']
    ],
    group: ['month'],
    order: [[literal('month'), 'DESC']],
    raw: true
});
    const totalBookings = await Booking.count();

const bookingsByMonth = await Booking.findAll({
    attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
        [fn('COUNT', col('id')), 'count']
    ],
    group: ['month'],
    order: [[literal('month'), 'DESC']],
    raw: true
});
const bookingPercentageGrowth = bookingsByMonth.length > 1 ? ((bookingsByMonth[0].count - bookingsByMonth[1].count) / bookingsByMonth[1].count ) * 100 : null
const totalAdmin = await Users.count({where: {
    rule: {
        [Op.or]: ["admin", "owner"],
    },
}});


const userPercentageGrowth = usersByMonth.length > 1 ? ((usersByMonth[0].count - usersByMonth[1].count) / usersByMonth[1].count ) * 100 : null
    const paymentByMonth = await Payment.findAll({where :{status:"accept"},
    attributes: [
        [fn('DATE_FORMAT', col('payment_date'), '%Y-%m'), 'month'],
        [fn('SUM', col('amount')), 'sum']
    ],
    group: ['month'],
    order: [[literal('month'), 'DESC']],
    raw: true
});
const totalValue = paymentByMonth.reduce((prevValues,currentValues)=>prevValues + parseInt(currentValues.sum),0)
const paymentPercentageGrowth = paymentByMonth.length > 1 ? ((paymentByMonth[0].sum - paymentByMonth[1].sum) / bookingsByMonth[1].sum ) * 100 : null


    return res.send({
        user:{totalUsers,userPercentageGrowth},
        booking:{
            totalBookings,
            bookingPercentageGrowth
        },
        payment:{
            totalValue,
            paymentPercentageGrowth
        },
        totalAdmin

    })
}
exports.quickStatistics = async (req,res) => {
    const bookingCounts = await Booking.findAll({
  attributes: [
    "membership",
    [fn("COUNT", col("membership")), "count"]
  ],
  where: { payment_access: "accept" },
  group: ["membership"],
  order: [[literal("count"), "DESC"]],
  limit: 1,
});
const totalPayment = await Payment.findAll({where :{status:"accept"}});
const totalValue = totalPayment.reduce((prevValues,currentValues)=>prevValues + currentValues.amount,0)

const totalBookings = await Booking.count({where :{payment_access:"accept"}});
    const revenue =  Math.round(totalValue / totalBookings)

    const paymentByMonth = await Payment.findAll({where :{status:"accept"},
    attributes: [
        [fn('DATE_FORMAT', col('payment_date'), '%Y-%m'), 'month'],
        [fn('SUM', col('amount')), 'sum']
    ],
    group: ['month'],
    order: [[literal('month'), 'DESC']],
    raw: true
});
const paymentGrowth = paymentByMonth.length > 1
  ? (((paymentByMonth[0].sum - paymentByMonth[1].sum) / paymentByMonth[1].sum) * 100).toFixed(2)
  : null;
    res.send({bookingCounts,revenue,paymentGrowth})
}
exports.calculateRevenue = async (req,res) => {
  // DATES
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);

  const startOfLastWeek = new Date(now);
  startOfLastWeek.setDate(now.getDate() - 14);

const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const startOfQuarter = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const startOfLastQuarter = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // WEEK
  const currentWeekRevenue = await Payment.sum("amount", {
    where: {
      status: "accept",
      payment_date: { [Op.gte]: startOfWeek },
    },
  });
  const lastWeekRevenue = await Payment.sum("amount", {
    where: {
      status: "accept",
      payment_date: {
        [Op.gte]: startOfLastWeek,
        [Op.lt]: startOfWeek,
      },
    },
  });

  // MONTH
  const currentMonthRevenue = await Payment.sum("amount", {
    where: {
      status: "accept",
      payment_date: {
        [Op.gte]: startOfMonth
      },
    },
  });

  const lastMonthRevenue = await Payment.sum("amount", {
    where:{
    status: "accept",
    payment_date: {
      [Op.gte]: startOfLastMonth,
      [Op.lt]: startOfMonth,
    },
  }
  });
  // QUARTER
  const currentQuarterRevenue = await Payment.sum("amount", {
    where: {
      status: "accept",
      payment_date: { [Op.gte]: startOfQuarter },
    },
  });

  const lastQuarterRevenue = await Payment.sum("amount", {
    where: {
      status: "accept",
      payment_date: {
        [Op.gte]: startOfLastQuarter,
        [Op.lt]: startOfQuarter,
      },
    },
  });

  // Function to calculate % growth
  const getGrowth = (current, previous) => {
    if (!previous || previous === 0) return null; // avoid division by zero
    return ((current - previous) / previous * 100).toFixed(2);
  };

  res.send({
    week: {
      total: currentWeekRevenue || 0,
      growth: getGrowth(currentWeekRevenue, lastWeekRevenue),
    },
    month: {
      total: currentMonthRevenue || 0,
      growth: getGrowth(currentMonthRevenue, lastMonthRevenue),
    },
    quarter: {
      total: currentQuarterRevenue || 0,
      growth: getGrowth(currentQuarterRevenue, lastQuarterRevenue),
    },
  });
};
exports.membershipStats = async (req, res) => {
  try {
    const totalBookings = await Booking.count({
      include: [{
        model: Payment,
        as:"paymentBooking",
        where: { status: "accept" }
      }]
    });

    const stats = await Booking.findAll({
      attributes: [
        "membership",
        [fn("COUNT", col("Booking.id")), "userCount"],
        [fn("SUM", col("paymentBooking.amount")), "totalRevenue"]
      ],
      include: [{
        model: Payment,
        attributes: [],
        as:"paymentBooking",
        where: { status: "accept" }
      }],
      group: ["membership"]
    });

    const result = stats.map(row => {
      const membership = row.membership;
      const count = parseInt(row.dataValues.userCount);
      const revenue = parseFloat(row.dataValues.totalRevenue || 0);
      const percent = ((count / totalBookings) * 100).toFixed(2);
      const average = count > 0 ? (revenue / count).toFixed(2) : "0.00";

      return {
        membership,
        users: count,
        percent,
        revenue: revenue.toFixed(2),
        average
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
exports.lastBookings = async (req,res) =>{
    const bookings = await Booking.findAll({
        limit:5,
        order:[["createdAt","DESC"]]
        ,include:{
        model:Users,
        as:"users",
        attributes:["id",'name',"last_name"]
    }});
    res.send(bookings)
}