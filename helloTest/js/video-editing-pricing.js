const buyNow = (amount, selectedPlan) => {
  let user = {};
  user.totalAmount = amount
  user.serviceName = 'Video Editing Services'
  user.selectedPlan = selectedPlan
  localStorage.setItem('userPlanDetails', JSON.stringify(user))
  window.location = '../video-editing-make-payment.html'
}