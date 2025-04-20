const NEW_REGISTER_TRIAL_DAYS = 3;

const MEMBERSHIP_TYPES = [
    {
      id: 0,
      name: "月度会员",
      unit: "月",
      totalPrice: 39,
      memberMonths: 1,
      note: "单月会员",
    },
    {
      id: 1,
      name: "季度会员",
      unit: "季",
      totalPrice: 99,
      memberMonths: 3,
      note: "相当于33元/月，节省15%",
    },
    {
      id: 2,
      name: "年度会员",
      unit: "年",
      totalPrice: 299,
      memberMonths: 12,
      note: "相当于25元/月，节省36%",
    },
  ];

  module.exports = {MEMBERSHIP_TYPES, NEW_REGISTER_TRIAL_DAYS};